import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// ✅ GET : récupérer toutes les commandes
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Erreur GET commandes:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les commandes." },
      { status: 500 }
    );
  }
}

// ✅ POST : créer une commande avec notification WhatsApp
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      items,
      shipping,
      paymentMethod,
      phoneNumber,
      additionalInfo,
    } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Création de la commande
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        paymentMethod,
        shippingName: shipping?.name,
        shippingAddress: shipping?.address,
        shippingCity: shipping?.city,
        shippingZip: shipping?.zip,
        shippingCountry: shipping?.country,
        phoneNumber,
        additionalInfo,
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    // 🔔 Envoi asynchrone du WhatsApp (ne bloque pas la réponse)
    sendWhatsAppNotification(order).catch(console.error);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Erreur création commande:", error);
    return NextResponse.json(
      { error: "Impossible de créer la commande." },
      { status: 500 }
    );
  }
}

// Fonction pour envoyer la notification WhatsApp
async function sendWhatsAppNotification(order: any) {
  try {
    // Votre numéro de téléphone (format international sans +)
    const yourPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

    if (!yourPhoneNumber) {
      console.warn("⚠️ ADMIN_PHONE_NUMBER non configuré");
      return;
    }

    // Message détaillé de la commande
    const itemsDetails = order.items
      .map(
        (item: any) =>
          `• ${item.product.name} x${item.quantity} - ${(
            item.price * item.quantity
          ).toFixed(2)}€`
      )
      .join("\n");

    const message = `🛍️ NOUVELLE COMMANDE #${order.id}

👤 Client: ${order.user?.name || order.shippingName || "Non spécifié"}
📞 Téléphone: ${order.phoneNumber || "Non spécifié"}
📍 Adresse: ${order.shippingAddress}, ${order.shippingZip} ${order.shippingCity}

📦 PRODUITS:
${itemsDetails}

💰 TOTAL: ${order.total.toFixed(2)}€
💳 Paiement: ${order.paymentMethod}
📝 Infos supplémentaires: ${order.additionalInfo || "Aucune"}

⏰ Date: ${new Date(order.createdAt).toLocaleString("fr-FR")}`;

    // Utilisation de CallMeBot
    await sendViaCallMeBot(yourPhoneNumber, message);

    console.log("✅ Notification WhatsApp envoyée avec succès");
  } catch (error) {
    console.error("❌ Erreur envoi WhatsApp:", error);
    // Ne pas bloquer la création de commande si l'envoi échoue
  }
}

// Méthode CallMeBot (Gratuit et Simple)
async function sendViaCallMeBot(phoneNumber: string, message: string) {
  try {
    const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY;

    if (!CALLMEBOT_API_KEY) {
      console.warn("⚠️ CALLMEBOT_API_KEY non configurée");
      return;
    }

    // Encoder le message pour URL
    const encodedMessage = encodeURIComponent(message);

    // URL de l'API CallMeBot
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneNumber}&text=${encodedMessage}&apikey=${CALLMEBOT_API_KEY}`;

    const response = await axios.get(url, { timeout: 10000 }); // Timeout de 10s

    console.log("📱 CallMeBot response:", response.data);

    // Vérifier si l'envoi a réussi
    if (response.data.includes("Message sent")) {
      console.log("✅ Message WhatsApp envoyé avec succès");
    } else {
      console.warn("⚠️ Réponse inattendue de CallMeBot:", response.data);
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur CallMeBot:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
}
