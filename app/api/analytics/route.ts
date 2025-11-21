import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("=== DEBUG ANALYTICS API ===");

    // Test 1: Vérifier les catégories existantes
    const allCategories = await prisma.category.findMany();
    console.log("Toutes les catégories:", allCategories);

    // Test 2: Vérifier les produits avec leurs catégories
    const productsWithCategories = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 5, // Limiter pour le debug
    });

    productsWithCategories.map((p) => ({
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      categoryName: p.category?.name,
    }));

    // Méthode optimisée pour les analytics
    const productsByCategory = await prisma.product.groupBy({
      by: ["categoryId"],
      _count: {
        id: true,
      },
    });

    console.log("Produits groupés par categoryId:", productsByCategory);

    // Récupérer les noms des catégories
    const categoryIds = productsByCategory.map((item) => item.categoryId);
    console.log("IDs de catégories trouvés:", categoryIds);

    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    console.log("Catégories correspondantes:", categories);

    // Fusionner les données
    const productsByCategoryWithNames = productsByCategory.map((item) => {
      const category = categories.find((cat) => cat.id === item.categoryId);
      const result = {
        categoryId: item.categoryId,
        categoryName: category?.name || `Catégorie ${item.categoryId}`,
        _count: item._count,
      };
      console.log(`Fusion: ${item.categoryId} -> ${result.categoryName}`);
      return result;
    });

    console.log("Résultat final:", productsByCategoryWithNames);

    // Le reste de votre code...
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const totalUsers = await prisma.user.count();

    // Calcul du revenue
    const completedOrders = await prisma.order.findMany({
      where: { status: "completed" },
      include: {
        items: true,
      },
    });

    const revenue = completedOrders.reduce((total, order) => {
      return (
        total +
        order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      );
    }, 0);

    const conversionRate =
      totalUsers > 0
        ? Number(((totalOrders / totalUsers) * 100).toFixed(1))
        : 0;

    const responseData = {
      totalProducts,
      productsByCategory: productsByCategoryWithNames,
      totalOrders,
      ordersByStatus,
      totalUsers,
      revenue,
      conversionRate,
    };

    console.log("=== FIN DEBUG ANALYTICS API ===");

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les analytics." },
      { status: 500 }
    );
  }
}
