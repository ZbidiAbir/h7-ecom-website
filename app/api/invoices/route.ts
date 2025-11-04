import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET : toutes les factures
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        order: {
          include: { user: true, items: { include: { product: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de récupérer les factures." },
      { status: 500 }
    );
  }
}

// POST : créer une facture
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, total, dueDate, pdfUrl } = body;

    if (!orderId || !total) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 }
      );
    }

    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId,
        total,
        dueDate: dueDate ? new Date(dueDate) : null,
        pdfUrl: pdfUrl || null,
        status: "UNPAID",
      },
      include: { order: true },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de créer la facture." },
      { status: 500 }
    );
  }
}
