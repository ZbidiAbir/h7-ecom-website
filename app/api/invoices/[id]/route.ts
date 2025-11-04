import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/invoices/:id
export async function GET(req: NextRequest, context: any) {
  const { params } = context;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        order: {
          include: {
            user: true,
            items: { include: { product: true } },
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Facture non trouvée." },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de récupérer la facture." },
      { status: 500 }
    );
  }
}

// PATCH /api/invoices/:id
export async function PATCH(req: NextRequest, context: any) {
  const { params } = context;

  try {
    const body = await req.json();
    const { status, pdfUrl, dueDate } = body;

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(pdfUrl && { pdfUrl }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        updatedAt: new Date(),
      },
      include: { order: true },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour la facture." },
      { status: 500 }
    );
  }
}

// DELETE /api/invoices/:id
export async function DELETE(req: NextRequest, context: any) {
  const { params } = context;

  try {
    await prisma.invoice.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Facture supprimée avec succès." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de supprimer la facture." },
      { status: 500 }
    );
  }
}
