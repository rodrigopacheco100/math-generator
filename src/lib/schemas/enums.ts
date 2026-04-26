export const DifficultyEnum = ["easy", "medium", "hard"] as const;
export type DifficultyType = (typeof DifficultyEnum)[number];

export const OperationEnum = [
  "addition",
  "subtraction",
  "multiplication",
  "division",
] as const;
export type OperationType = (typeof OperationEnum)[number];
