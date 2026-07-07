import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db";
import { applications, schemes } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

function generateRef(prefix: string) {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

export async function GET() {
  try {
    const rows = await db
      .select({
        id: applications.id,
        referenceNumber: applications.referenceNumber,
        citizenName: applications.citizenName,
        phone: applications.phone,
        language: applications.language,
        status: applications.status,
        schemeName: schemes.name,
        submittedAt: applications.submittedAt,
      })
      .from(applications)
      .leftJoin(schemes, eq(applications.schemeId, schemes.id))
      .orderBy(desc(applications.submittedAt));
    return NextResponse.json({ applications: rows });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load applications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const referenceNumber = generateRef("APP");
    const [row] = await db
      .insert(applications)
      .values({
        referenceNumber,
        schemeId: body.schemeId ?? null,
        citizenName: body.citizenName ?? null,
        phone: body.phone ?? null,
        language: body.language ?? "hi",
        extractedData: body.extractedData ?? {},
        missingDocs: body.missingDocs ?? [],
        status: "pending",
        confidence: 92,
      })
      .returning({ id: applications.id, referenceNumber: applications.referenceNumber });
    return NextResponse.json({ application: row });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to submit application";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
