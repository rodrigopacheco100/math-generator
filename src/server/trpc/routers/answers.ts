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

const arithmeticAnswerSchema = z.object({
  value: z.union([z.number(), z.string()]),
});

const divisibilityAnswerSchema = z.object({
  value: z.array(z.number()),
});

const powerAnswerSchema = z.object({
  value: z.union([z.number(), z.string()]),
});

const arithmeticInputSchema = z.object({
  operation: z.enum(["addition", "subtraction", "multiplication", "division"]),
  problem: problemSchema,
  userAnswer: arithmeticAnswerSchema,
  correctAnswer: arithmeticAnswerSchema,
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const divisibilityInputSchema = z.object({
  operation: z.literal("divisibility"),
  problem: problemSchema,
  userAnswer: divisibilityAnswerSchema,
  correctAnswer: divisibilityAnswerSchema,
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const powerInputSchema = z.object({
  operation: z.enum(["power", "square_root"]),
  problem: problemSchema,
  userAnswer: powerAnswerSchema,
  correctAnswer: powerAnswerSchema,
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const inputSchema = z.discriminatedUnion("operation", [
  arithmeticInputSchema,
  divisibilityInputSchema,
  powerInputSchema,
]);

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

    const isCorrect =
      JSON.stringify(userAnswer.value) === JSON.stringify(correctAnswer.value);

    await db.insert(answers).values({
      userId,
      operation,
      problem,
      userAnswer,
      correctAnswer,
      isCorrect,
      difficulty: difficulty as DifficultyType,
    });

    return { isCorrect };
  });

export const answersRouter = createTRPCRouter({
  submitAnswer,
});
