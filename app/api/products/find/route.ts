// /api/products/find/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const color = searchParams.get("color");
  const size = searchParams.get("size");

  // On construit dynamiquement les conditions "where"
  const where: any = {};

  if (color) {
    where.colors = {
      some: { color },
    };
  }

  if (size) {
    where.sizes = {
      some: { size },
    };
  }

  try {
    const product = await prisma.product.findFirst({
      where,
      include: {
        colors: true,
        sizes: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Aucun produit trouvé pour cette combinaison." },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du produit." },
      { status: 500 }
    );
  }
}
