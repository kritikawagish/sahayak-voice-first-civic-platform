import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications, complaints, schemes, officials } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apps = await db
      .select({
        id: applications.id,
        type: sql<"application">`'application'`.as("type"),
        referenceNumber: applications.referenceNumber,
        title: schemes.name,
        citizenName: applications.citizenName,
        status: applications.status,
        priority: sql<number>`CASE WHEN ${applications.status} = 'pending' THEN 3 ELSE 1 END`.as("priority"),
        createdAt: applications.submittedAt,
      })
      .from(applications)
      .leftJoin(schemes, eq(applications.schemeId, schemes.id))
      .orderBy(desc(applications.submittedAt));

    const cmps = await db
      .select({
        id: complaints.id,
        type: sql<"complaint">`'complaint'`.as("type"),
        referenceNumber: complaints.referenceNumber,
        title: sql<string>`CONCAT(UPPER(${complaints.category}), ' complaint')`.as("title"),
        citizenName: complaints.citizenPhone,
        status: complaints.status,
        priority: complaints.priority,
        createdAt: complaints.openedAt,
      })
      .from(complaints)
      .orderBy(desc(complaints.priority), desc(complaints.openedAt));

    const officialRows = await db.select().from(officials);

    const queue = [...apps, ...cmps].sort((a, b) => {
      const pa = a.priority ?? 0;
      const pb = b.priority ?? 0;
      if (pb !== pa) return pb - pa;
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });

    return NextResponse.json({ queue, officials: officialRows });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load queue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
