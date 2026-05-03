import {
  pgTable,
  uuid,
  text,
  date,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

const genderEnum = pgEnum("gender", ["male", "female"]);

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().notNull().generatedAlwaysAs("gen_random_uuid()"),
  patientCode: text("patient_code").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: genderEnum("gender").notNull().default("male"),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  registeredBy: text("registered_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
