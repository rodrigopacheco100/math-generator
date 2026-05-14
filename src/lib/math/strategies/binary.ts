import type { Difficulty, MathProblem, UserAnswer } from "../types";
import type { MathStrategy, OperationConfig } from "./base";
import { type BinaryOperationConfig, operationConfig } from "./config";

const symbols: Record<string, string> = {
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
};

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class BinaryStrategy implements MathStrategy {
  readonly type = "binary";
  readonly category = "arithmetic";

  constructor(private operation: string) {}

  getConfig(difficulty: Difficulty): OperationConfig {
    return operationConfig[this.operation][difficulty];
  }

  generateProblem(
    difficulty: Difficulty,
  ): MathProblem & { correctAnswer: number } {
    const config = this.getConfig(difficulty) as BinaryOperationConfig;

    if (this.operation === "division") {
      const divisor = getRandomInt(config.operatorMin, config.operatorMax);
      const quotient = getRandomInt(config.operatorMin, config.operatorMax);
      const dividend = divisor * quotient;

      return {
        operands: [dividend, divisor],
        correctAnswer: quotient,
      };
    }

    const operand1 = getRandomInt(config.operandMin, config.operandMax);

    let operand2: number;
    if (this.operation === "subtraction") {
      operand2 = getRandomInt(config.operatorMin, operand1);
    } else {
      operand2 = getRandomInt(config.operatorMin, config.operatorMax);
    }

    let correctAnswer: number;
    switch (this.operation) {
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

    return {
      operands: [operand1, operand2],
      correctAnswer,
    };
  }

  formatProblem(problem: MathProblem): string {
    const symbol = symbols[this.operation] || this.operation;
    return `${problem.operands[0]} ${symbol} ${problem.operands[1]} = ?`;
  }

  checkAnswer(
    _problem: MathProblem,
    userAnswer: UserAnswer,
    correctAnswer: number,
  ): boolean {
    return userAnswer.value === correctAnswer;
  }
}
