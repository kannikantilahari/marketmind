import { numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  productService: text("product_service").notNull(),
  targetAudience: text("target_audience").notNull(),
  budget: numeric("budget", { precision: 12, scale: 2 }).notNull(),
  platform: text("platform").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  goal: text("goal").notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
