import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Récupérer toutes les couleurs distinctes de tous les produits
    const colors = await prisma.productColor.findMany({
      select: {
        color: true,
      },
      distinct: ["color"],
    });

    // Compter le nombre de produits par couleur
    const colorsWithCount = await Promise.all(
      colors.map(async (colorObj) => {
        const count = await prisma.product.count({
          where: {
            colors: {
              some: {
                color: colorObj.color,
              },
            },
          },
        });

        return {
          name: colorObj.color,
          value: colorObj.color.toLowerCase(),
          count: count,
        };
      })
    );

    return NextResponse.json(colorsWithCount);
  } catch (error) {
    console.error("Erreur lors de la récupération des couleurs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des couleurs" },
      { status: 500 }
    );
  }
}
