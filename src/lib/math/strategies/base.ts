import type { Difficulty, MathProblem, UserAnswer } from "../types";

export type OperationConfig = Record<string, unknown>;

export type DifficultyConfig = {
  easy: OperationConfig;
  medium: OperationConfig;
  hard: OperationConfig;
};

export interface MathStrategy {
  readonly type: string;
  readonly category: string;

  getConfig(difficulty: Difficulty): OperationConfig;
  generateProblem(
    difficulty: Difficulty,
  ): MathProblem & { correctAnswer: number | string };
  formatProblem(problem: MathProblem): string;
  checkAnswer(
    problem: MathProblem,
    userAnswer: UserAnswer,
    correctAnswer: number | string,
  ): boolean;
}
