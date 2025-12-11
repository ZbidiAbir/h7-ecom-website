// app/api/visitors/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const total = await prisma.visitor.count();
    return NextResponse.json({ total });
  } catch (error) {
    console.error("visitors error", error);
    return NextResponse.json({ total: 0 }, { status: 500 });
  }
}
