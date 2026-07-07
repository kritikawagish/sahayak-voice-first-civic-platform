import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { applications, schemes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;

    const [row] = await db
      .select({
        id: applications.id,
        referenceNumber: applications.referenceNumber,
        citizenName: applications.citizenName,
        phone: applications.phone,
        language: applications.language,
        status: applications.status,
        schemeName: schemes.name,
        extractedData: applications.extractedData,
        missingDocs: applications.missingDocs,
        confidence: applications.confidence,
        submittedAt: applications.submittedAt,
        updatedAt: applications.updatedAt,
      })
      .from(applications)
      .leftJoin(schemes, eq(applications.schemeId, schemes.id))
      .where(eq(applications.referenceNumber, ref));

    if (!row) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application: row });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to fetch application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await params;
    const body = await req.json();

    const [row] = await db
      .update(applications)
      .set({
        status: body.status,
        extractedData: body.extractedData,
        missingDocs: body.missingDocs,
        confidence: body.confidence,
      })
      .where(eq(applications.referenceNumber, ref))
      .returning({ id: applications.id, referenceNumber: applications.referenceNumber });

    if (!row) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ application: row });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to update application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}