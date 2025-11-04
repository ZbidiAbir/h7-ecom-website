import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/products
 * Récupère la liste de tous les produits avec regroupement par catégorie et couleur
 * + Filtrage possible par prix, couleur, catégorie, et catégorie parente ("Jeans" par défaut)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Récupération des filtres existants
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const color = searchParams.get("color");
    const categoryId = searchParams.get("categoryId");
    const parentCategory = searchParams.get("parentCategory") || "Jeans"; // ✅ "Jeans" par défaut
    const groupByCategoryColor = searchParams.get("groupByCategoryColor"); // Optionnel: activer/désactiver regroupement

    // Construction dynamique du filtre Prisma
    const where: any = {};

    // Filtrage par catégorie
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // ✅ Filtrage par catégorie parente ("Jeans" par défaut)
    where.category = {
      ...(where.category || {}),
      parent: {
        ...(where.category?.parent || {}),
        name: {
          equals: parentCategory,
          mode: "insensitive",
        },
      },
    };

    // Filtrage par couleur
    if (color) {
      where.colors = {
        some: {
          color: {
            equals: color,
            mode: "insensitive",
          },
        },
      };
    }

    // Filtrage par prix
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Requête principale Prisma
    const products = await prisma.product.findMany({
      where,
      include: {
        author: { select: { name: true, image: true } },
        category: {
          include: {
            parent: true,
            sizes: true, // ✅ indispensable pour récupérer les tailles de la catégorie
          },
        },
        images: true,
        colors: true,
        sizes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Si le regroupement est désactivé, retourner tous les produits
    if (groupByCategoryColor === "false") {
      return NextResponse.json(products);
    }

    // 🔹 REGROUPEMENT par catégorie et couleur
    const groupedProducts = groupProductsByCategoryAndColor(products);

    return NextResponse.json(groupedProducts);
  } catch (error) {
    console.error("Erreur GET /products avec filtres :", error);
    return NextResponse.json(
      { error: "Échec lors de la récupération des produits" },
      { status: 500 }
    );
  }
}

/**
 * Fonction utilitaire pour regrouper les produits par catégorie et couleur
 * Retourne un seul produit par combinaison catégorie/couleur
 */
function groupProductsByCategoryAndColor(products: any[]) {
  const groupedMap = new Map();

  products.forEach((product) => {
    const mainColor = product.colors?.[0]?.color || "default";
    const groupKey = `${product.categoryId}-${mainColor}`;

    // 🔹 Récupérer les tailles du produit et celles de la catégorie associée
    const productSizes = product.sizes?.map((s: any) => s.size) || [];
    const categorySizes =
      product.category?.sizes?.map((s: any) => s.size) || [];
    const combinedSizes = [...new Set([...productSizes, ...categorySizes])];

    if (!groupedMap.has(groupKey)) {
      groupedMap.set(groupKey, {
        ...product,
        availableSizes: combinedSizes,
      });
    } else {
      const existingProduct = groupedMap.get(groupKey);

      // Fusionner les tailles sans doublons
      existingProduct.availableSizes = [
        ...new Set([...existingProduct.availableSizes, ...combinedSizes]),
      ];

      // Mettre à jour le stock total (optionnel)
      existingProduct.stock =
        (existingProduct.stock || 0) + (product.stock || 0);
    }
  });

  return Array.from(groupedMap.values());
}
