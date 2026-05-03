import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

const roleEnum = pgEnum("role", ["admin", "receptionist", "finance"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().generatedAlwaysAs("gen_random_uuid()"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: roleEnum("role").notNull().default("receptionist"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const dentistProfiles = pgTable("dentist_profiles", {
  id: uuid("id").primaryKey().generatedAlwaysAs("gen_random_uuid()"),
  userId: uuid("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  specialization: text("specialization").notNull(),
  phoneNumber: text("phone_number").notNull(),
  availableDays: jsonb("available_days").notNull(),
  workingHours: jsonb("working_hours").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
