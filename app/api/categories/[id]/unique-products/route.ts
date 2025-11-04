import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/categories/[id]/unique-products
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Await the params Promise
  const { id } = await params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            colors: true,
            images: true,
            sizes: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const uniqueProductsByColor: Record<string, any> = {};

    category.products.forEach((product: any) => {
      // Si le produit a des couleurs, on prend une par couleur
      if (product.colors && product.colors.length > 0) {
        product.colors.forEach((colorObj: any) => {
          const color = colorObj.color.toLowerCase();
          if (!uniqueProductsByColor[color]) {
            uniqueProductsByColor[color] = {
              ...product,
              // On garde seulement la couleur courante pour ce produit
              colors: [colorObj],
            };
          }
        });
      } else {
        // Si le produit n'a pas de couleurs, on l'ajoute directement
        // On utilise l'ID du produit comme clé pour éviter les doublons
        const key = `no-color-${product.id}`;
        if (!uniqueProductsByColor[key]) {
          uniqueProductsByColor[key] = product;
        }
      }
    });

    const result = Object.values(uniqueProductsByColor);

    return NextResponse.json({
      category,
      products: result,
      totalProducts: category.products.length,
      uniqueProducts: result.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch unique products" },
      { status: 500 }
    );
  }
}
