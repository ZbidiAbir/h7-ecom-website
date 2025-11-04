import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/products/:id
 */
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;
  if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        colors: true,
        sizes: true,
        images: true,
        category: {
          include: {
            products: {
              include: {
                colors: true,
                sizes: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!product)
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * PATCH /api/products/:id
 */
export async function PATCH(request: NextRequest, context: any) {
  const { id } = context.params;
  await requireAdmin();
  if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

  try {
    const body = await request.json();
    const { colors, sizes, images, ...otherData } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...otherData,
        colors: {
          deleteMany: {},
          create: colors.map((color: string) => ({ color })),
        },
        sizes: {
          deleteMany: {},
          create: sizes.map((size: string) => ({ size })),
        },
        images: {
          deleteMany: {},
          create: images.map((url: string) => ({ url })),
        },
      },
      include: { colors: true, sizes: true, images: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * DELETE /api/products/:id
 */
export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
  await requireAdmin();
  if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Produit supprimé" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
