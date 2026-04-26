import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { responsibles } from "./responsibles";
import { users } from "./users";

export const userResponsibles = pgTable(
  "user_responsibles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    responsibleId: uuid("responsible_id")
      .references(() => responsibles.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userResponsibleIdx: { columns: [table.userId, table.responsibleId] },
  }),
);

export const userResponsiblesRelations = relations(
  userResponsibles,
  ({ one }) => ({
    user: one(users, {
      fields: [userResponsibles.userId],
      references: [users.id],
    }),
    responsible: one(responsibles, {
      fields: [userResponsibles.responsibleId],
      references: [responsibles.id],
    }),
  }),
);

export type UserResponsible = typeof userResponsibles.$inferSelect;
