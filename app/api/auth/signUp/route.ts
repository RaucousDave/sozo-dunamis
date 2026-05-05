import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

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
    const passwordHash = await bcrypt.hash(password, 10);

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

    const [newUser] = await db
      .insert(users)
      .values({ name, role, password: passwordHash, email })
      .returning();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
