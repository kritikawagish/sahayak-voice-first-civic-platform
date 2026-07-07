import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { applications, complaints } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, status, officialId, draft } = body;

    if (type === "application") {
      const [updated] = await db
        .update(applications)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(applications.id, Number(id)))
        .returning({ referenceNumber: applications.referenceNumber, status: applications.status });
      return NextResponse.json({ updated, draft });
    }

    if (type === "complaint") {
      const [updated] = await db
        .update(complaints)
        .set({
          status,
          officialId: officialId ? Number(officialId) : null,
        })
        .where(eq(complaints.id, Number(id)))
        .returning({ referenceNumber: complaints.referenceNumber, status: complaints.status });
      return NextResponse.json({ updated, draft });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to respond";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
