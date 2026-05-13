import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be more than two characters long"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["administrator", "receptionist", "dentist"]),
  password: z.string().min(8, "Password must be 8 characters or longer"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = signUpSchema.safeParse(body);
    if (!validation.success) {
      const message = validation.error.issues.map((e) => e.message).join(", ");
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { name, role, password, email } = validation.data;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists" },
        { status: 400 },
      );
    }

    await auth.api.signUpEmail({
      body: { name, password, email },
    });

    await db.update(users).set({ role }).where(eq(users.email, email));

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.log("Error: ", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
