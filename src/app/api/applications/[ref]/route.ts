import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const rows = await db
      .select({
        id: applications.id,
        referenceNumber: applications.referenceNumber,
        citizenName: applications.citizenName,
        status: applications.status,
        submittedAt: applications.submittedAt,
        updatedAt: applications.updatedAt,
      })
      .from(applications)
      .where(eq(applications.referenceNumber, ref));
    if (rows.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }
    return NextResponse.json({ application: rows[0] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
