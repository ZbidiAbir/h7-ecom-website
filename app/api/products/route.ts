import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/products
 * Récupère la liste de tous les produits avec leurs relations
 */
// Ajoutez ce filtre dans votre API existante
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Récupération des filtres existants
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const color = searchParams.get("color");
    const categoryId = searchParams.get("categoryId");
    const parentCategory = searchParams.get("parentCategory"); // Nouveau filtre

    // Construction dynamique du filtre Prisma
    const where: any = {};

    // Filtrage par catégorie
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // NOUVEAU : Filtrage par catégorie parente
    if (parentCategory) {
      where.category = {
        parent: {
          name: {
            equals: parentCategory,
            mode: "insensitive",
          },
        },
      };
    }

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

    // Requête principale Prisma avec inclusion du parent
    const products = await prisma.product.findMany({
      where,
      include: {
        author: { select: { name: true, image: true } },
        category: {
          include: {
            parent: true, // Important: inclure le parent
          },
        },
        images: true,
        colors: true,
        sizes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur GET /products avec filtres :", error);
    return NextResponse.json(
      { error: "Échec lors de la récupération des produits" },
      { status: 500 }
    );
  }
}
/**
 * POST /api/products
 * Crée un nouveau produit (admin requis)
 */
export async function POST(request: NextRequest) {
  const user = await requireAdmin();

  try {
    const {
      name,
      description,
      price,
      discount,
      colors,
      sizes,
      inStock,
      stock,
      images,
      categoryId,
    } = await request.json();

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Le nom, le prix et la catégorie sont obligatoires" },
        { status: 400 }
      );
    }

    // 🔹 Récupération de la catégorie avec son parent
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { parent: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        discount: discount ?? 0,
        inStock: inStock ?? true,
        stock: stock ? parseInt(stock) : 0,
        authorId: user.id,
        categoryId,
        parentId: category.parentId ?? null, // 🔹 Ici on assigne le parentId
        images: images?.length
          ? { create: images.map((url: string) => ({ url })) }
          : undefined,
        colors: colors?.length
          ? { create: colors.map((color: string) => ({ color })) }
          : undefined,
        sizes: sizes?.length
          ? { create: sizes.map((size: string) => ({ size })) }
          : undefined,
      },
      include: {
        author: { select: { name: true, image: true } },
        category: true,
        images: true,
        colors: true,
        sizes: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /products :", error);
    return NextResponse.json(
      { error: "Échec lors de la création du produit" },
      { status: 500 }
    );
  }
}
