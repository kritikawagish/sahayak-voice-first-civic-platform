import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { proxyRatings } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db.select().from(proxyRatings).orderBy(desc(proxyRatings.createdAt));
    return NextResponse.json({ ratings: rows });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load ratings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [row] = await db
      .insert(proxyRatings)
      .values({
        sessionType: body.sessionType ?? "application",
        proxyName: body.proxyName ?? "Unknown Sahayak",
        citizenPhone: body.citizenPhone ?? null,
        rating: Number(body.rating),
        feedback: body.feedback ?? null,
      })
      .returning();
    return NextResponse.json({ rating: row });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to save rating";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
