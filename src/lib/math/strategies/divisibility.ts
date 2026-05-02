import type { Difficulty, MathProblem, UserAnswer } from "../types";
import type { MathStrategy, OperationConfig } from "./base";

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const divisibilityConfig = {
  easy: { min: 1, max: 50 },
  medium: { min: 1, max: 100 },
  hard: { min: 1, max: 1000 },
};

export class DivisibilityStrategy implements MathStrategy {
  readonly type = "divisibility";
  readonly category = "arithmetic";

  getConfig(difficulty: Difficulty): OperationConfig {
    return divisibilityConfig[difficulty];
  }

  generateProblem(
    difficulty: Difficulty,
  ): MathProblem & { correctAnswer: string | number | number[] } {
    const config = this.getConfig(difficulty) as typeof divisibilityConfig.easy;

    let number: number;
    let correctDivisors: number[] = [];

    // Keep generating numbers until we find one with at least one valid divisor
    do {
      number = getRandomInt(config.min, config.max);
      correctDivisors = [2, 3, 4, 5, 6, 8, 9, 10, 100, 1000].filter(
        (d) => d <= number && number % d === 0,
      );
    } while (correctDivisors.length === 0);

    return {
      operands: [number],
      correctAnswer: correctDivisors,
    };
  }

  formatProblem(problem: MathProblem): string {
    return `${problem.operands[0]} é divisível por quais?`;
  }

  checkAnswer(
    _problem: MathProblem,
    userAnswer: UserAnswer,
    correctAnswer: string | number | number[],
  ): boolean {
    // Handle different types of user answers
    let userDivisors: number[];

    if (Array.isArray(userAnswer.value)) {
      userDivisors = userAnswer.value as number[];
    } else if (typeof userAnswer.value === "string") {
      userDivisors = userAnswer.value
        .split(",")
        .map((d) => parseInt(d.trim()))
        .filter((d) => !Number.isNaN(d));
    } else {
      // Single number
      userDivisors = [userAnswer.value as number];
    }

    // Handle different types of correct answers
    let correctDivisors: number[];

    if (Array.isArray(correctAnswer)) {
      correctDivisors = correctAnswer;
    } else if (typeof correctAnswer === "string") {
      correctDivisors = correctAnswer
        .split(",")
        .map((d) => parseInt(d.trim()))
        .filter((d) => !Number.isNaN(d));
    } else {
      // Single number
      correctDivisors = [correctAnswer as number];
    }

    // Sort both arrays and compare
    const userSorted = userDivisors.sort((a, b) => a - b);
    const correctSorted = correctDivisors.sort((a, b) => a - b);

    return JSON.stringify(userSorted) === JSON.stringify(correctSorted);
  }
}
