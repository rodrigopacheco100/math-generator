import "server-only";
import { and, eq, gte, lt } from "drizzle-orm";
import { DateTime } from "luxon";
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

const USER_TIMEZONE = "America/Sao_Paulo";

const PERIOD_CONFIG: Record<
  Period,
  { subtract: object; unit: "day" | "week" | "month" }
> = {
  daily: { subtract: { days: 1 }, unit: "day" },
  weekly: { subtract: { weeks: 1 }, unit: "week" },
  monthly: { subtract: { months: 1 }, unit: "month" },
};

function getDateRange(period: Period) {
  const now = DateTime.now().setZone(USER_TIMEZONE);
  const config = PERIOD_CONFIG[period];

  const currentStart = now.startOf(config.unit);
  const previousStart = now.minus(config.subtract).startOf(config.unit);
  const previousEnd = now.minus(config.subtract).endOf(config.unit);

  return {
    start: currentStart.toJSDate(),
    end: now.toJSDate(),
    prevStart: previousStart.toJSDate(),
    prevEnd: previousEnd.toJSDate(),
  };
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
