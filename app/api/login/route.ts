import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { users } from "@/db";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["administrator", "receptionist", "dentist"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      const message = validation.error.issues.map((e) => e.message).join(", ");
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { email, password, role } = validation.data;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user || user.role !== role) {
      return NextResponse.json({ error: "Invalid details" }, { status: 401 });
    }

    const data = await auth.api
      .signInEmail({
        body: { email, password },
        asResponse: true, // ← tells Better Auth to return a full Response object
      })
      .catch((err) => {
        if (
          err?.status === 401 ||
          err?.body?.code === "INVALID_EMAIL_OR_PASSWORD"
        ) {
          return null;
        }
        throw err;
      });

    if (!data?.ok) {
      return NextResponse.json({ error: "Invalid details" }, { status: 401 });
    }
    // Add this ↓
    console.log("Better Auth response status:", data?.status);
    const responseBody = await data?.clone().json();
    console.log("Better Auth response body:", responseBody);

    // Forward the Set-Cookie header from Better Auth to the browser
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 },
    );

    const setCookie = data.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (err) {
    console.error("Login error:", JSON.stringify(err, null, 2));
    console.error("Error message:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
