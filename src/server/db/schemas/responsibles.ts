import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const responsibles = pgTable("responsibles", {
  id: uuid("id").primaryKey().defaultRandom(),
  googleId: text("google_id").unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Responsible = typeof responsibles.$inferSelect;
