import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { patients } from "@/db";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session)
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 401 },
      );

    const allPatients = await db.select().from(patients);
    if (!allPatients) return NextResponse.json({ error: "No patients" });
    return NextResponse.json(
      { message: "Patients fetched successfully", patients: allPatients },
      { status: 200 },
    );
  } catch (error) {
    console.log("[GET api/patients error]: ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
}
