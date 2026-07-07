import { NextResponse } from "next/server";
import { db } from "@/db";
import { schemes } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(schemes);
    return NextResponse.json({ schemes: rows });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load schemes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
