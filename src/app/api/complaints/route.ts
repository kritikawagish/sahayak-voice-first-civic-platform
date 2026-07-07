import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { complaints } from "@/db/schema";
import { desc } from "drizzle-orm";

function generateRef(prefix: string) {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

function categoryPriority(category: string): number {
  switch (category) {
    case "ration":
      return 5;
    case "water":
      return 4;
    case "electricity":
      return 4;
    case "sanitation":
      return 3;
    case "road":
      return 3;
    default:
      return 2;
  }
}

export async function GET() {
  try {
    const rows = await db.select().from(complaints).orderBy(desc(complaints.openedAt));
    return NextResponse.json({ complaints: rows });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load complaints";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category = body.category ?? "other";
    const referenceNumber = generateRef("CMP");
    const [row] = await db
      .insert(complaints)
      .values({
        referenceNumber,
        category,
        description: body.description ?? "",
        location: body.location ?? "",
        citizenPhone: body.citizenPhone ?? null,
        status: "open",
        priority: categoryPriority(category),
        slaHours: body.slaHours ?? 72,
      })
      .returning({ id: complaints.id, referenceNumber: complaints.referenceNumber });
    return NextResponse.json({ complaint: row });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to register complaint";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
