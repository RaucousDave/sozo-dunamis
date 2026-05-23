import { patients, nextOfKin } from "@/db";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";

const GenderEnum = z.enum(["male", "female"]);
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
export const patientSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 character")
      .max(50, "First name must be at most 50 character"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be above 50 character"),
    dateOfBirth: z
      .string()
      .refine(
        (val) => {
          const date = new Date(val);
          return !isNaN(date.getTime());
        },
        {
          error: "Invalid date object",
        },
      )
      .pipe(z.coerce.date())
      .refine((date) => date < new Date(), {
        error: "Date of birth cannot be in the future",
      }),

    gender: GenderEnum,
    email: z.string().email("Email is invalid"),
    address: z.string(),
    phoneNumber: z.string().length(11),
    nokName: z.string(),
    nokPhone: z.string().length(11),
  })
  .strip();

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();

    const result = patientSchema.safeParse(body);

    if (!result.success) {
      console.log("Zod validation POST [/api/patients/new]: ", result);
      return NextResponse.json(
        {
          error: "Something went wrong",
          errors: result.error.issues,
        },
        { status: 400 },
      );
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      address,
      phoneNumber,
      nokName,
      nokPhone,
    } = result.data;

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

    const patientCode: string = await generatePatientCode();

    await db.transaction(async (tx) => {
      const [newPatient] = await tx
        .insert(patients)
        .values({
          patientCode,
          firstName,
          lastName,
          dateOfBirth: dateOfBirth.toISOString().split("T")[0],
          gender,
          email,
          address,
          phoneNumber,
          createdAt: new Date(),
          registeredBy: userName,
        })
        .returning({ patientId: patients.id });

      await tx.insert(nextOfKin).values({
        name: nokName,
        phoneNumber: nokPhone,
        patientId: newPatient.patientId,
        createdAt: new Date(),
      });
    });

    return NextResponse.json(
      { message: "Patient created successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("POST [/api/patients/new]: ", err);
    return NextResponse.json(
      { error: "Something went wrong", err },
      { status: 400 },
    );
  }
}
