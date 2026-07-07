import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { officials, applications, complaints } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const officialId = Number(body.officialId);
    const [official] = await db.select().from(officials).where(eq(officials.id, officialId));
    if (!official) {
      return NextResponse.json({ error: "Official not found" }, { status: 404 });
    }

    const appCounts = await db
      .select({ status: applications.status, count: sql<number>`count(*)`.as("count") })
      .from(applications)
      .groupBy(applications.status);

    const cmpCounts = await db
      .select({ status: complaints.status, count: sql<number>`count(*)`.as("count") })
      .from(complaints)
      .where(eq(complaints.officialId, officialId))
      .groupBy(complaints.status);

    const brief = {
      official: official.name,
      role: official.role,
      jurisdiction: official.jurisdiction,
      workloadScore: official.workloadScore,
      patterns: official.decisionNotes ?? [],
      applicationSummary: appCounts,
      assignedComplaintSummary: cmpCounts,
      advice: [
        "Prioritize ration and water complaints first.",
        "Verify death certificate for widow pension applications.",
        "Escalate road complaints to PWD after 48 hours.",
      ],
    };

    return NextResponse.json({ brief });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to generate handover brief";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
