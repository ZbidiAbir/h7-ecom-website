// app/api/categories/[id]/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params to resolve the Promise
    const { id } = await params;

    // Récupérer la catégorie avec ses tailles et couleurs
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        sizes: true,
        colors: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Récupérer les produits de cette catégorie
    const products = await prisma.product.findMany({
      where: { categoryId: id },
      include: {
        images: true,
        sizes: true,
        colors: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      category,
      products,
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    return NextResponse.json(
      { error: "Failed to fetch category products" },
      { status: 500 }
    );
  }
}
