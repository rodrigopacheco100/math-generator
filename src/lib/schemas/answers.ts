import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { DifficultyEnum, OperationEnum } from "./enums";
import { users } from "./users";

export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  operation: text("operation", { enum: OperationEnum }).notNull(),
  operand1: integer("operand1").notNull(),
  operand2: integer("operand2").notNull(),
  userAnswer: integer("user_answer").notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  isCorrect: integer("is_correct").notNull(),
  difficulty: text("difficulty", { enum: DifficultyEnum }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const answersRelations = relations(answers, ({ one }) => ({
  user: one(users, { fields: [answers.userId], references: [users.id] }),
}));

export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert;
