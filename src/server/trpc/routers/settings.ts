import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../db/db";
import { userSettings, users } from "../../db/schemas";
import type { DifficultyType } from "../../db/schemas/enums";
import { createTRPCRouter, protectedProcedure } from "../init";

const DifficultySchema = z.enum(["easy", "medium", "hard"]);

export const settingsRouter = createTRPCRouter({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx.session;

    const db = await getDb();

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (userResult.length === 0) {
      return { difficulty: "easy" as DifficultyType };
    }

    const userId = userResult[0].id;

    const settings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    if (settings.length === 0) {
      const newSettings = await db
        .insert(userSettings)
        .values({ userId, difficulty: "easy" })
        .returning();

      return { difficulty: newSettings[0].difficulty as DifficultyType };
    }

    return { difficulty: settings[0].difficulty as DifficultyType };
  }),

  updateSettings: protectedProcedure
    .input(z.object({ difficulty: DifficultySchema.optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.difficulty) {
        return { success: true };
      }

      const session = ctx.session;

      const db = await getDb();

      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1);

      if (userResult.length === 0) {
        throw new Error("User not found");
      }

      const userId = userResult[0].id;

      await db
        .insert(userSettings)
        .values({ userId, difficulty: input.difficulty, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: userSettings.userId,
          set: { difficulty: input.difficulty, updatedAt: new Date() },
        });

      return { success: true };
    }),

  updateDifficulty: protectedProcedure
    .input(z.object({ difficulty: DifficultySchema }))
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      const db = await getDb();

      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, session.user.email))
        .limit(1);

      if (userResult.length === 0) {
        throw new Error("User not found");
      }

      const userId = userResult[0].id;

      await db
        .insert(userSettings)
        .values({ userId, difficulty: input.difficulty })
        .onConflictDoUpdate({
          target: userSettings.userId,
          set: { difficulty: input.difficulty, updatedAt: new Date() },
        });

      return { success: true };
    }),
});
