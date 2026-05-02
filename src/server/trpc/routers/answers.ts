import "server-only";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../db/db";
import { answers, users } from "../../db/schemas";
import type { DifficultyType } from "../../db/schemas/enums";
import { createTRPCRouter, protectedProcedure } from "../init";

const problemSchema = z.object({
  operands: z.array(z.number()),
});

const userAnswerSchema = z.union([
  z.number(),
  z.string(),
  z.object({ value: z.union([z.number(), z.string()]) }),
]);

const correctAnswerSchema = z.union([
  z.number(),
  z.string(),
  z.object({ value: z.union([z.number(), z.string()]) }),
]);

const inputSchema = z.object({
  operation: z.string(),
  problem: problemSchema,
  userAnswer: userAnswerSchema,
  correctAnswer: correctAnswerSchema,
  difficulty: z.enum(["easy", "medium", "hard"]),
});

function extractValue(val: unknown): string | number {
  if (typeof val === "number" || typeof val === "string") {
    return val;
  }
  if (typeof val === "object" && val !== null && "value" in val) {
    return (val as { value: string | number }).value;
  }
  return 0;
}

function normalizeValue(val: unknown): unknown {
  if (typeof val === "number" || typeof val === "string") {
    return val;
  }
  if (typeof val === "object" && val !== null && "value" in val) {
    return val;
  }
  return { value: val };
}

export const submitAnswer = protectedProcedure
  .input(inputSchema)
  .mutation(async ({ input, ctx }) => {
    const db = await getDb();
    const { operation, problem, userAnswer, correctAnswer, difficulty } = input;

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, ctx.session.user.email))
      .limit(1);

    if (userResult.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const userId = userResult[0].id;

    const userVal = extractValue(userAnswer);
    const correctVal = extractValue(correctAnswer);
    const isCorrect = userVal === correctVal;

    await db.insert(answers).values({
      userId,
      operation,
      problem,
      userAnswer: normalizeValue(userAnswer),
      correctAnswer: normalizeValue(correctAnswer),
      isCorrect,
      difficulty: difficulty as DifficultyType,
    });

    return { isCorrect };
  });

export const answersRouter = createTRPCRouter({
  submitAnswer,
});
