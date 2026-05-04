import {
  pgTable,
  uuid,
  text,
  date,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const genderEnum = pgEnum("gender", ["male", "female"]);

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  patientCode: text("patient_code").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: genderEnum("gender").notNull().default("male"),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  registeredBy: uuid("registered_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const nextOfKin = pgTable("next_of_kin", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  patientId: uuid("patient_id").references(() => patients.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
