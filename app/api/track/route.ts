// app/api/track/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Optional: Filter out localhost or development IPs if desired
    if (ip === "127.0.0.1" || ip === "::1") {
      return NextResponse.json({ ok: true, debug: "Localhost skipped" });
    }

    // Check for existing visitor (case-insensitive, trimmed)
    const existing = await prisma.visitor.findFirst({
      where: { ip: { equals: ip, mode: "insensitive" } },
    });

    if (!existing) {
      await prisma.visitor.create({ data: { ip: ip.trim(), userAgent } });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("track error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
