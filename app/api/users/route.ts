import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET : récupérer tous les utilisateurs
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        comments: true,
        products: true,
        orders: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur GET /users:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}

// ✅ POST : créer un nouvel utilisateur
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, image, role } = body;

    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Utilisateur déjà existant" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        image,
        role: role || "USER",
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /users:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}
