import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  googleId: text("google_id").unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  answers: many(answers),
  userSettings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  responsibles: many(userResponsibles),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Re-export for relations
import { answers } from "./answers";
import { userResponsibles } from "./userResponsibles";
import { userSettings } from "./userSettings";
