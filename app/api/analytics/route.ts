import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Total produits
    const totalProducts = await prisma.product.count();
    const productsByCategory = await prisma.product.groupBy({
      by: ["categoryId"],
      _count: { id: true },
    });

    // Total commandes
    const totalOrders = await prisma.order.count();
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    // Total utilisateurs
    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      totalProducts,
      productsByCategory,
      totalOrders,
      ordersByStatus,
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de récupérer les analytics." },
      { status: 500 }
    );
  }
}
