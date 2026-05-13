import { patients } from "@/db";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const patientId = await params;

    if (!patientId || typeof patientId !== "string")
      return NextResponse.json({ error: "Patient Id is invalid" });

    const [existing] = await db
      .select()
      .from(patients)
      .where(eq(patients.id, patientId));

    if (!existing)
      return NextResponse.json(
        { error: "Patient does not exist" },
        { status: 404 },
      );

    return NextResponse.json(
      { message: "Patient data fetched successfully", patient: existing },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
}
