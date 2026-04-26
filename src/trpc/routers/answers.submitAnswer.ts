import "server-only";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import type { Difficulty, IntegerOperations } from "@/lib/math";
import { answers, users } from "@/lib/schemas";
import { createTRPCRouter, protectedProcedure } from "../init";

const inputSchema = z.object({
  operation: z.enum(["addition", "subtraction", "multiplication", "division"]),
  operand1: z.number(),
  operand2: z.number(),
  userAnswer: z.number(),
  correctAnswer: z.number(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const _outputSchema = z.object({
  isCorrect: z.boolean(),
});

export const submitAnswer = protectedProcedure
  .input(inputSchema)
  .mutation(async ({ input, ctx }) => {
    const db = await getDb();
    const {
      operation,
      operand1,
      operand2,
      userAnswer,
      correctAnswer,
      difficulty,
    } = input;

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
    const isCorrect = userAnswer === correctAnswer;

    await db.insert(answers).values({
      userId,
      operation: operation as IntegerOperations.Operation,
      operand1,
      operand2,
      userAnswer,
      correctAnswer,
      isCorrect: isCorrect ? 1 : 0,
      difficulty: difficulty as Difficulty,
    });

    return { isCorrect };
  });

export const answersRouter = createTRPCRouter({
  submitAnswer,
});
