import type { Difficulty, MathProblem, UserAnswer } from "../types";
import type { MathStrategy, OperationConfig } from "./base";

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const powerConfig = {
  easy: { baseMin: 2, baseMax: 10, exponentMin: 2, exponentMax: 3 },
  medium: { baseMin: 10, baseMax: 30, exponentMin: 2, exponentMax: 4 },
  hard: { baseMin: 30, baseMax: 100, exponentMin: 2, exponentMax: 5 },
};

const sqrtConfig = {
  easy: { min: 1, max: 25 }, // Perfect squares up to 5²
  medium: { min: 1, max: 100 }, // Perfect squares up to 10²
  hard: { min: 1, max: 400 }, // Perfect squares up to 20²
};

function getPerfectSquares(min: number, max: number): number[] {
  const squares: number[] = [];
  const start = Math.ceil(Math.sqrt(min));
  const end = Math.floor(Math.sqrt(max));

  for (let i = start; i <= end; i++) {
    squares.push(i * i);
  }

  return squares;
}

export class PowerStrategy implements MathStrategy {
  readonly type = "power";
  readonly category = "power";

  getConfig(difficulty: Difficulty): OperationConfig {
    return powerConfig[difficulty];
  }

  generateProblem(
    difficulty: Difficulty,
  ): MathProblem & { correctAnswer: number } {
    const config = this.getConfig(difficulty) as typeof powerConfig.easy;

    const base = getRandomInt(config.baseMin, config.baseMax);
    const exponent = getRandomInt(config.exponentMin, config.exponentMax);
    const correctAnswer = Math.pow(base, exponent);

    return {
      type: "power",
      operands: [base, exponent],
      correctAnswer,
    };
  }

  formatProblem(problem: MathProblem): string {
    return `${problem.operands[0]}^${problem.operands[1]} = ?`;
  }

  checkAnswer(
    _problem: MathProblem,
    userAnswer: UserAnswer,
    correctAnswer: number,
  ): boolean {
    return Number(userAnswer.value) === correctAnswer;
  }
}

export class SquareRootStrategy implements MathStrategy {
  readonly type = "square_root";
  readonly category = "power";

  getConfig(difficulty: Difficulty): OperationConfig {
    return sqrtConfig[difficulty];
  }

  generateProblem(
    difficulty: Difficulty,
  ): MathProblem & { correctAnswer: number } {
    const config = this.getConfig(difficulty) as typeof sqrtConfig.easy;
    const perfectSquares = getPerfectSquares(config.min, config.max);

    const randomSquare =
      perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
    const correctAnswer = Math.sqrt(randomSquare);

    return {
      type: "square_root",
      operands: [randomSquare],
      correctAnswer,
    };
  }

  formatProblem(problem: MathProblem): string {
    return `√${problem.operands[0]} = ?`;
  }

  checkAnswer(
    _problem: MathProblem,
    userAnswer: UserAnswer,
    correctAnswer: number,
  ): boolean {
    return Number(userAnswer.value) === correctAnswer;
  }
}
