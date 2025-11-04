import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET : récupérer une commande spécifique
export async function GET(req: NextRequest, context: any) {
  const id = context.params.id;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée." },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de récupérer la commande." },
      { status: 500 }
    );
  }
}

// PATCH : mettre à jour la commande (et générer une facture si CONFIRMED)
export async function PATCH(req: NextRequest, context: any) {
  const id = context.params.id;

  try {
    const body = await req.json();
    const {
      status,
      notes,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingZip,
      shippingCountry,
    } = body;

    // Récupérer la commande avec ses items et produits
    let order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, user: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée." },
        { status: 404 }
      );
    }

    // Mettre à jour la commande
    order = await prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes && { notes }),
        ...(shippingName && { shippingName }),
        ...(shippingAddress && { shippingAddress }),
        ...(shippingCity && { shippingCity }),
        ...(shippingZip && { shippingZip }),
        ...(shippingCountry && { shippingCountry }),
        updatedAt: new Date(),
      },
      include: { items: { include: { product: true } }, user: true },
    });

    // ✅ Si la commande devient CONFIRMED → générer automatiquement la facture
    if (status === "CONFIRMED") {
      const existingInvoice = await prisma.invoice.findFirst({
        where: { orderId: order.id },
      });

      if (!existingInvoice) {
        await prisma.invoice.create({
          data: {
            invoiceNumber: `INV-${Date.now()}`,
            orderId: order.id,
            total: order.total,
            status: "UNPAID",
          },
        });
        console.log(`✅ Facture générée pour la commande ${order.id}`);
      }
    }

    // ✅ Si la commande est COMPLETED → mettre à jour le stock
    if (status === "COMPLETED") {
      for (const item of order.items) {
        const currentStock = item.product.stock;

        if (item.quantity >= currentStock) {
          await prisma.product.update({
            where: { id: item.product.id },
            data: { stock: 0, inStock: false },
          });
        } else {
          await prisma.product.update({
            where: { id: item.product.id },
            data: { stock: currentStock - item.quantity },
          });
        }
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Erreur PATCH:", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour la commande." },
      { status: 500 }
    );
  }
}

// DELETE : supprimer une commande
export async function DELETE(req: NextRequest, context: any) {
  const id = context.params.id;

  try {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ message: "Commande supprimée avec succès." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Impossible de supprimer la commande." },
      { status: 500 }
    );
  }
}
