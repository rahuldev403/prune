import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const audits = pgTable("audits", {
  id: uuid("id").primaryKey().defaultRandom(),
  inputData: jsonb("input_data").notNull(),
  engineResults: jsonb("engine_results").notNull(),
  totalMonthlySavings: integer("total_monthly_savings").notNull(),
  aiSummery: text("ai_summery"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  companyName: text("company_name"),
  role: text("role"),
  teamSize: text("team_size"),
  auditId: uuid("audit_id")
    .references(() => audits.id)
    .notNull(),
  createAt: timestamp("created_at").defaultNow().notNull(),
});
