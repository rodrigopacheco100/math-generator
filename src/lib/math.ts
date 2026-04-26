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
    easy: {
      operandMin: number;
      operandMax: number;
      operatorMin: number;
      operatorMax: number;
    };
    medium: {
      operandMin: number;
      operandMax: number;
      operatorMin: number;
      operatorMax: number;
    };
    hard: {
      operandMin: number;
      operandMax: number;
      operatorMin: number;
      operatorMax: number;
    };
  }

  export const operationConfig: Record<Operation, OperationConfig> = {
    addition: {
      easy: { operandMin: 1, operandMax: 50, operatorMin: 1, operatorMax: 50 },
      medium: {
        operandMin: 51,
        operandMax: 100,
        operatorMin: 51,
        operatorMax: 100,
      },
      hard: {
        operandMin: 101,
        operandMax: 1000,
        operatorMin: 101,
        operatorMax: 1000,
      },
    },
    subtraction: {
      easy: { operandMin: 1, operandMax: 50, operatorMin: 1, operatorMax: 50 },
      medium: {
        operandMin: 51,
        operandMax: 100,
        operatorMin: 51,
        operatorMax: 100,
      },
      hard: {
        operandMin: 101,
        operandMax: 1000,
        operatorMin: 101,
        operatorMax: 1000,
      },
    },
    multiplication: {
      easy: {
        operandMin: 10,
        operandMax: 100,
        operatorMin: 2,
        operatorMax: 10,
      },
      medium: {
        operandMin: 100,
        operandMax: 2000,
        operatorMin: 10,
        operatorMax: 50,
      },
      hard: {
        operandMin: 2000,
        operandMax: 10000,
        operatorMin: 50,
        operatorMax: 200,
      },
    },
    division: {
      easy: {
        operandMin: 10,
        operandMax: 100,
        operatorMin: 2,
        operatorMax: 10,
      },
      medium: {
        operandMin: 100,
        operandMax: 2000,
        operatorMin: 10,
        operatorMax: 50,
      },
      hard: {
        operandMin: 2000,
        operandMax: 10000,
        operatorMin: 50,
        operatorMax: 200,
      },
    },
  };

  export function getDifficultyLabel(
    operation: Operation,
    difficulty: Difficulty,
  ): string {
    const config = operationConfig[operation][difficulty];
    return `${translatedDifficulty[difficulty]}`;
  }

  export function generateProblem(
    operation: Operation,
    difficulty: Difficulty,
  ): MathProblem {
    const config = operationConfig[operation][difficulty];

    if (operation === "division") {
      const divisor = getRandomInt(
        config.operatorMin,
        Math.min(10, config.operatorMax),
      );
      const quotient = getRandomInt(config.operatorMin, config.operatorMax);
      const dividend = divisor * quotient;

      return {
        operand1: dividend,
        operand2: divisor,
        operation,
        correctAnswer: quotient,
      };
    }

    const operand1 = getRandomInt(config.operandMin, config.operandMax);

    let operand2: number;
    if (operation === "subtraction") {
      operand2 = getRandomInt(config.operatorMin, operand1);
    } else {
      operand2 = getRandomInt(config.operatorMin, config.operatorMax);
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
