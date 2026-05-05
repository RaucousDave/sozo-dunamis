import { betterAuth } from "better-auth";
import { db } from "./db";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import * as schema from "../db/index";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      account: schema.account,
      verification: schema.verification,
      session: schema.session,
    },
  }),
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 
  },
  emailAndPassword: {
    enabled: true,
  },
});
