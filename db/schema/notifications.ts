import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { appointments } from "./appointments";

export const recipientEnum = pgEnum("recipientType", ["patient", "dentist"]);
export const triggerEnum = pgEnum("triggerType", [
  "new booking",
  "reminder_24h",
  "reminder_1h",
  "cancellation",
  "reschedule",
]);
export const channelEnum = pgEnum("channel", ["email", "SMS"]);
export const notificationStatusEnum = pgEnum("notification_status", [
  "pending",
  "sent",
  "failed",
]);

export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  recipientType: recipientEnum("recipient_type").notNull(),
  appointmentId: text("appointment_id").references(() => appointments.id),
  triggerType: triggerEnum("trigger_type").notNull(),
  channel: channelEnum("channel").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  status: notificationStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
