import { betterAuth } from "better-auth";
import { db } from "./db";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import * as schema from "../db/index";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
});
