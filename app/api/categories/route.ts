// app/api/categories/route.ts
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/categories - Récupère toutes les catégories avec leurs relations
 */
// Dans votre route GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Si un ID est fourni, retourner une catégorie spécifique
    if (id) {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          parent: true,
          products: {
            select: { id: true, name: true },
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
    }

    // Sinon, retourner toutes les catégories
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        products: { select: { id: true, name: true } },
        images: true,
        sizes: true,
        colors: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(categories);
  } catch (err) {
    console.error("Erreur GET /api/categories:", err);
    return NextResponse.json(
      { error: "Échec de la récupération des catégories" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories - Crée une nouvelle catégorie avec images, tailles et couleurs
 */
export async function POST(request: NextRequest) {
  await requireAdmin();

  try {
    const body = await request.json();
    const { name, parentId, images = [], sizes = [], colors = [] } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        parentId: parentId || null, // <- lien avec le parent
        images: { create: images.map((url: string) => ({ url })) },
        sizes: { create: sizes.map((size: string) => ({ size })) },
        colors: { create: colors.map((color: string) => ({ color })) },
      },
      include: { images: true, sizes: true, colors: true, parent: true },
    });

    return NextResponse.json(category);
  } catch (err) {
    console.error("Erreur POST /api/categories:", err);
    return NextResponse.json(
      { error: "Échec de la création de la catégorie" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/categories - Met à jour une catégorie existante
 */
export async function PATCH(request: NextRequest) {
  await requireAdmin();

  try {
    const body = await request.json();
    const { id, name, parentId, images = [], sizes = [], colors = [] } = body;

    if (!id || !name?.trim()) {
      return NextResponse.json(
        { error: "L'ID et le nom de la catégorie sont requis" },
        { status: 400 }
      );
    }

    // Mise à jour du nom et du parent
    await prisma.category.update({
      where: { id },
      data: { name, parentId: parentId || null },
    });

    // Supprime puis recrée les relations
    await Promise.all([
      prisma.categoryImage.deleteMany({ where: { categoryId: id } }),
      prisma.categorySize.deleteMany({ where: { categoryId: id } }),
      prisma.categoryColor.deleteMany({ where: { categoryId: id } }),
    ]);

    if (images.length)
      await prisma.categoryImage.createMany({
        data: images.map((url: string) => ({ url, categoryId: id })),
      });

    if (sizes.length)
      await prisma.categorySize.createMany({
        data: sizes.map((size: string) => ({ size, categoryId: id })),
      });

    if (colors.length)
      await prisma.categoryColor.createMany({
        data: colors.map((color: string) => ({ color, categoryId: id })),
      });

    const updatedCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        images: true,
        sizes: true,
        colors: true,
        products: true,
        parent: true,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (err) {
    console.error("Erreur PATCH /api/categories:", err);
    return NextResponse.json(
      { error: "Échec de la mise à jour de la catégorie" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories - Supprime une catégorie par ID
 */
export async function DELETE(request: NextRequest) {
  await requireAdmin();

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "L'ID de la catégorie est requis" },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: "Catégorie supprimée avec succès" });
  } catch (err) {
    console.error("Erreur DELETE /api/categories:", err);
    return NextResponse.json(
      { error: "Échec de la suppression de la catégorie" },
      { status: 500 }
    );
  }
}
