import { pgEnum, pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { appointments } from "./appointments";

const recipientEnum = pgEnum("recipientType", ["patient", "dentist"]);
const triggerEnum = pgEnum("triggerType", [
  "new booking",
  "reminder_24h",
  "reminder_1h",
  "cancellation",
  "reschedule",
]);
const channelEnum = pgEnum("channel", ["email", "SMS"]);
const statusEnum = pgEnum("status", ["pending", "sent", "failed"]);

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().notNull().generatedAlwaysAs("gen_random_uuid"),
  recipientType: recipientEnum("recipient_type").notNull(),
  appointmentId: uuid("appointment_id").references(() => appointments.id),
  triggerType: triggerEnum("trigger_type").notNull(),
  channel: channelEnum("channel").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  status: statusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
