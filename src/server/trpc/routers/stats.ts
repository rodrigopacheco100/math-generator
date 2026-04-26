import "server-only";
import { and, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../db/db";
import { answers, users } from "../../db/schemas";
import type { OperationType } from "../../db/schemas/enums";
import { createTRPCRouter, protectedProcedure } from "../init";

const OPERATION_LABELS: Record<string, { name: string; symbol: string }> = {
  addition: { name: "Soma", symbol: "+" },
  subtraction: { name: "Subtração", symbol: "−" },
  multiplication: { name: "Multiplicação", symbol: "×" },
  division: { name: "Divisão", symbol: "÷" },
};

const OPERATIONS = [
  "addition",
  "subtraction",
  "multiplication",
  "division",
] as const;

type Period = "daily" | "weekly" | "monthly";

function getDateRange(period: Period) {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);
  const prevEnd = new Date(now);
  const prevStart = new Date(now);

  if (period === "daily") {
    start.setDate(start.getDate() - 1);
    prevEnd.setDate(prevEnd.getDate() - 1);
    prevStart.setDate(prevStart.getDate() - 2);
  } else if (period === "weekly") {
    start.setDate(start.getDate() - 7);
    prevEnd.setDate(prevEnd.getDate() - 7);
    prevStart.setDate(prevStart.getDate() - 14);
  } else if (period === "monthly") {
    start.setMonth(start.getMonth() - 1);
    prevEnd.setMonth(prevEnd.getMonth() - 1);
    prevStart.setMonth(prevStart.getMonth() - 2);
  }

  return { start, end, prevStart, prevEnd };
}

async function getStatsForPeriod(
  db: Awaited<ReturnType<typeof getDb>>,
  userId: string,
  start: Date,
  end: Date,
  operation?: OperationType,
) {
  const where = operation
    ? and(
        eq(answers.userId, userId),
        eq(answers.operation, operation),
        gte(answers.createdAt, start),
        lt(answers.createdAt, end),
      )
    : and(
        eq(answers.userId, userId),
        gte(answers.createdAt, start),
        lt(answers.createdAt, end),
      );

  const result = await db.select().from(answers).where(where);

  const totalAnswers = result.length;
  const correctAnswers = result.filter((a) => a.isCorrect === 1).length;
  const accuracy =
    totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  return { totalAnswers, correctAnswers, accuracy };
}

const inputSchema = z.object({
  period: z.enum(["daily", "weekly", "monthly"]).default("daily"),
});

export const getStats = protectedProcedure
  .input(inputSchema)
  .query(async ({ input, ctx }) => {
    const db = await getDb();
    const { period } = input;

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, ctx.session.user.email))
      .limit(1);

    if (userResult.length === 0) {
      return {
        period,
        operations: OPERATIONS.map((op) => ({
          operation: op,
          ...OPERATION_LABELS[op],
          current: { totalAnswers: 0, correctAnswers: 0, accuracy: 0 },
          previous: { totalAnswers: 0, correctAnswers: 0, accuracy: 0 },
          comparison: 0,
        })),
      };
    }

    const userId = userResult[0].id;
    const { start, end, prevStart, prevEnd } = getDateRange(period);

    const operations = await Promise.all(
      OPERATIONS.map(async (op) => {
        const current = await getStatsForPeriod(db, userId, start, end, op);
        const previous = await getStatsForPeriod(
          db,
          userId,
          prevStart,
          prevEnd,
          op,
        );

        let comparison = 0;
        if (previous.accuracy > 0) {
          comparison = Math.round(current.accuracy - previous.accuracy);
        } else if (current.accuracy > 0) {
          comparison = current.accuracy;
        }

        return {
          operation: op,
          ...OPERATION_LABELS[op],
          current,
          previous,
          comparison,
        };
      }),
    );

    return { period, operations };
  });

export const statsRouter = createTRPCRouter({
  getStats,
});
