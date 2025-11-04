import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/category-parents - Récupère toutes les catégories parentes avec leurs sous-catégories
 */
export async function GET() {
  try {
    const parents = await prisma.categoryParent.findMany({
      include: {
        categories: {
          include: {
            images: true,
            sizes: true,
            colors: true,
            products: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(parents);
  } catch (err) {
    return NextResponse.json(
      { error: "Échec de la récupération" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/category-parents - Crée une nouvelle catégorie parente
 */
export async function POST(request: NextRequest) {
  await requireAdmin();

  try {
    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Le nom de la catégorie parente est requis" },
        { status: 400 }
      );
    }

    const parent = await prisma.categoryParent.create({
      data: { name },
    });

    return NextResponse.json(parent);
  } catch (err) {
    console.error("❌ Erreur POST /api/category-parents:", err);
    return NextResponse.json(
      { error: "Échec de la création de la catégorie parente" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/category-parents - Met à jour une catégorie parente existante
 */
export async function PATCH(request: NextRequest) {
  await requireAdmin();

  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id || !name?.trim()) {
      return NextResponse.json(
        { error: "L'ID et le nom de la catégorie parente sont requis" },
        { status: 400 }
      );
    }

    const updated = await prisma.categoryParent.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ Erreur PATCH /api/category-parents:", err);
    return NextResponse.json(
      { error: "Échec de la mise à jour de la catégorie parente" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/category-parents - Supprime une catégorie parente
 */
export async function DELETE(request: NextRequest) {
  await requireAdmin();

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "L'ID de la catégorie parente est requis" },
        { status: 400 }
      );
    }

    // Supprimer d'abord les catégories associées ou détacher leur parent
    await prisma.category.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    });

    await prisma.categoryParent.delete({ where: { id } });

    return NextResponse.json({
      message: "Catégorie parente supprimée avec succès",
    });
  } catch (err) {
    console.error("❌ Erreur DELETE /api/category-parents:", err);
    return NextResponse.json(
      { error: "Échec de la suppression de la catégorie parente" },
      { status: 500 }
    );
  }
}
