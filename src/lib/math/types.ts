export type Difficulty = "easy" | "medium" | "hard";

export const translatedDifficulty: Record<Difficulty, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

export interface MathProblem {
  type: string;
  operands: number[];
}

export interface UserAnswer {
  value: string | number;
}

export interface StoredProblem extends MathProblem {
  correctAnswer: number | string;
}

export type OperationCategory =
  | "arithmetic"
  | "power"
  | "percentage"
  | "fraction"
  | "equation"
  | "geometry";
