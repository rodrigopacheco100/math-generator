import type { DifficultyConfig } from "./base";

export type BinaryOperationConfig = {
  operandMin: number;
  operandMax: number;
  operatorMin: number;
  operatorMax: number;
};

export const operationConfig: Record<string, DifficultyConfig> = {
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
    easy: { operandMin: 10, operandMax: 100, operatorMin: 2, operatorMax: 10 },
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
    easy: { operandMin: 10, operandMax: 100, operatorMin: 2, operatorMax: 10 },
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
