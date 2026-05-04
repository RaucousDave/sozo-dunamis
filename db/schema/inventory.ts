import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { appointments } from "./appointments";
import { users } from "./users";

export const categoryEnum = pgEnum("category", [
  "consumable",
  "medication",
  "equipment",
]);

export const transactionEnum = pgEnum("transactionType", [
  "restock",
  "usage",
  "adjustment",
  "disposal",
]);
export const inventoryItems = pgTable("inventory_items", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  category: categoryEnum("category").notNull(),
  unit: text("unit"),
  currentQuantity: integer("current_quantity").notNull(),
  minimumThreshold: integer("minimum_threshold").notNull(),
  costPerUnit: integer("cost_per_unit").notNull(),
  supplierName: text("supplier_name"),
  lastRestockedAt: timestamp("last_restocked_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const inventoryTransactions = pgTable("inventory_transactions", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  itemId: text("item_id").references(() => inventoryItems.id),
  transactionType: transactionEnum("transaction_type").notNull(),
  quantity: integer("quantity").notNull(),
  referenceId: text("reference_id").references(() => appointments.id),
  performedBy: text("performed_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
