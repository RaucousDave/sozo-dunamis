import {
  pgEnum,
  pgTable,
  text,
  date,
  time,
  timestamp,
} from "drizzle-orm/pg-core";
import { patients } from "./patients";
import { dentistProfiles, users } from "./users";

export const appointmentEnum = pgEnum("appointment_type", [
  "Fillings",
  "Dental Implants",
  "Oral surgery",
  "Pediatric Dentistry",
  "Emergency Care",
  "Preventive Care",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
]);
export const appointments = pgTable("appointments", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  appointmentCode: text("appointment_code").notNull(),
  patientId: text("patient_id").references(() => patients.id),
  dentistId: text("dentist_id").references(() => dentistProfiles.id),
  appointmentType: appointmentEnum("appointment_type").notNull(),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: time("appointment_time").notNull(),
  status: appointmentStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  bookedBy: text("booked_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appointmentProcedure = pgTable("appointment_procedure", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  appointmentId: text("appointment_id").references(() => appointments.id),
  procedureName: text("procedure_name").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
