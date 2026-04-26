import type { DifficultyType } from "../server/db/schemas/enums";

export type Difficulty = DifficultyType;
export const translatedDifficulty: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

export interface MathProblem {
  operand1: number;
  operand2: number;
  operation: IntegerOperations.Operation;
  correctAnswer: number;
}

export const operationSymbols: Record<IntegerOperations.Operation, string> = {
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
};

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export namespace IntegerOperations {
  export type Operation =
    | "addition"
    | "subtraction"
    | "multiplication"
    | "division";

  export interface OperationConfig {
    easy: { min: number; max: number };
    medium: { min: number; max: number };
    hard: { min: number; max: number };
  }

  export const operationConfig: Record<Operation, OperationConfig> = {
    addition: {
      easy: { min: 1, max: 50 },
      medium: { min: 51, max: 100 },
      hard: { min: 101, max: 1000 },
    },
    subtraction: {
      easy: { min: 1, max: 50 },
      medium: { min: 51, max: 100 },
      hard: { min: 101, max: 1000 },
    },
    multiplication: {
      easy: { min: 1, max: 10 },
      medium: { min: 11, max: 50 },
      hard: { min: 51, max: 120 },
    },
    division: {
      easy: { min: 1, max: 10 },
      medium: { min: 11, max: 20 },
      hard: { min: 21, max: 100 },
    },
  };

  export function getDifficultyLabel(
    operation: Operation,
    difficulty: Difficulty,
  ): string {
    const config = operationConfig[operation][difficulty];
    return `${translatedDifficulty[difficulty]} (${config.min}-${config.max})`;
  }

  export function generateProblem(
    operation: Operation,
    difficulty: Difficulty,
  ): MathProblem {
    const config = operationConfig[operation][difficulty];

    if (operation === "division") {
      const divisor = getRandomInt(1, Math.min(10, config.max));
      const quotient = getRandomInt(config.min, config.max);
      const dividend = divisor * quotient;

      return {
        operand1: dividend,
        operand2: divisor,
        operation,
        correctAnswer: quotient,
      };
    }

    const max = config.max;
    const operand1 = getRandomInt(config.min, max);

    let operand2: number;
    if (operation === "subtraction") {
      operand2 = getRandomInt(config.min, operand1);
    } else {
      operand2 = getRandomInt(config.min, max);
    }

    let correctAnswer: number;
    switch (operation) {
      case "addition":
        correctAnswer = operand1 + operand2;
        break;
      case "subtraction":
        correctAnswer = operand1 - operand2;
        break;
      case "multiplication":
        correctAnswer = operand1 * operand2;
        break;
      default:
        correctAnswer = operand1 + operand2;
    }

    return { operand1, operand2, operation, correctAnswer };
  }
}

export function generateProblem(
  operation: IntegerOperations.Operation,
  difficulty: Difficulty,
): MathProblem {
  return IntegerOperations.generateProblem(operation, difficulty);
}

export function formatProblem(problem: MathProblem): string {
  const symbol = operationSymbols[problem.operation];
  return `${problem.operand1} ${symbol} ${problem.operand2} = ?`;
}
