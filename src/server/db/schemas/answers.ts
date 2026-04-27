import { relations } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { DifficultyEnum } from "./enums";
import { users } from "./users";

export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  operation: text("operation").notNull(),
  problem: jsonb("problem").notNull(),
  userAnswer: jsonb("user_answer").notNull(),
  correctAnswer: jsonb("correct_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  difficulty: text("difficulty", { enum: DifficultyEnum }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const answersRelations = relations(answers, ({ one }) => ({
  user: one(users, { fields: [answers.userId], references: [users.id] }),
}));

export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert;
