import { patients } from "@/db";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Patient ID is invalid" },
        { status: 400 },
      );
    }

    const [existing] = await db
      .select()
      .from(patients)
      .where(eq(patients.id, id));

    if (!existing)
      return NextResponse.json(
        { error: "Patient does not exist" },
        { status: 404 },
      );

    return NextResponse.json(
      { message: "Patient data fetched successfully", patient: existing },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || typeof id !== "string")
      return NextResponse.json({ error: "Id is invalid" }, { status: 400 });

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
      address,
    } = await req.json();

    const [existingPatient] = await db
      .select()
      .from(patients)
      .where(eq(patients.id, id));
    if (!existingPatient)
      return NextResponse.json(
        { error: "Patient does not exist" },
        { status: 400 },
      );

    const [updatedPatient] = await db
      .update(patients)
      .set({
        firstName,
        lastName,
        dateOfBirth,
        gender,
        phoneNumber,
        email,
        address,
      })
      .where(eq(patients.id, id))
      .returning();

    return NextResponse.json(
      {
        message: "Patient data edited successfully",
        patient: updatedPatient,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in patients edit route: ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 },
    );
  }
}
