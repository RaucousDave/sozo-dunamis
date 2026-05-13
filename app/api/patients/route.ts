import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { patients } from "@/db";

export async function GET(req: NextRequest) {
  try {
    const allPatients = await db.select().from(patients);
    if (!allPatients) return NextResponse.json({ error: "No patients" });
    return NextResponse.json(
      { message: "Patients fetched successfully", patients: allPatients },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
}
