import { NextResponse } from "next/server";
import { db } from "@/db";
import { complaints } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const complaintId = Number(id);
    const [existing] = await db.select().from(complaints).where(eq(complaints.id, complaintId));
    if (!existing) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    const rtiDraft = `
To,
The Public Information Officer,
${existing.location || "Municipal Office"}

Subject: RTI application regarding unresolved complaint ${existing.referenceNumber}

Dear Sir/Madam,
A complaint regarding ${existing.category} was registered on ${existing.openedAt?.toDateString() || "N/A"} at ${existing.location}. Despite the prescribed time limit, no action has been taken. Please provide the following information:
1. Current status of the complaint.
2. Name and designation of the officer assigned.
3. Expected date of resolution.

Thank you,
Sahayak Auto-RTI System
`.trim();

    const [updated] = await db
      .update(complaints)
      .set({
        status: "escalated",
        escalatedAt: new Date(),
        rtiDraft,
      })
      .where(eq(complaints.id, complaintId))
      .returning({ referenceNumber: complaints.referenceNumber, rtiDraft: complaints.rtiDraft });

    return NextResponse.json({ complaint: updated });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to escalate complaint";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
