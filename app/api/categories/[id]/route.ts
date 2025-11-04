import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/categories/:id - Détails d’une catégorie
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true, // <-- Inclut la catégorie parente
        products: {
          include: {
            colors: true,
            images: true,
            sizes: true,
          },
        },
        images: true,
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

    return NextResponse.json(category);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch category details" },
      { status: 500 }
    );
  }
}
