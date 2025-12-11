// app/api/track/route.ts
export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";

    const userAgent = req.headers.get("user-agent") || "unknown";

    const existing = await prisma.visitor.findFirst({ where: { ip } });

    if (!existing) {
      await prisma.visitor.create({ data: { ip, userAgent } });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("track error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
