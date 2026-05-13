import { patients } from "@/db";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      address,
      phoneNumber,
    } = await req.json();

    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender ||
      !email ||
      !address ||
      !phoneNumber
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    async function generatePatientCode(): Promise<string> {
      const random = Math.floor(Math.random() * 9000) + 1000;
      const code = `PAT-${random}`;

      const existing = await db
        .select()
        .from(patients)
        .where(eq(patients.patientCode, code))
        .limit(1);

      if (existing.length > 0) return generatePatientCode();

      return code;
    }

    const userName = session.user.id;

    const patientCode = await generatePatientCode();

    await db.insert(patients).values({
      patientCode,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      address,
      phoneNumber,
      createdAt: new Date(),
      registeredBy: userName,
    });

    return NextResponse.json(
      { message: "Patient created successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Error in patients posting route: ", err);
    return NextResponse.json(
      { error: "Something went wrong", err },
      { status: 400 },
    );
  }
}
