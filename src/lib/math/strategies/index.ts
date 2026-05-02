import type { MathStrategy } from "./base";
import { BinaryStrategy } from "./binary";
import { DivisibilityStrategy } from "./divisibility";
import { PowerStrategy, SquareRootStrategy } from "./power";

const strategies = new Map<Operation, MathStrategy>();

const mappedStrategiesByOperation: Record<Operation, MathStrategy> = {
  addition: new BinaryStrategy("addition"),
  subtraction: new BinaryStrategy("subtraction"),
  multiplication: new BinaryStrategy("multiplication"),
  division: new BinaryStrategy("division"),
  power: new PowerStrategy(),
  square_root: new SquareRootStrategy(),
  divisibility: new DivisibilityStrategy(),
};

for (const [operation, strategy] of Object.entries(
  mappedStrategiesByOperation,
)) {
  strategies.set(operation as Operation, strategy);
}

export function getStrategy(operation: Operation): MathStrategy {
  const strategy = strategies.get(operation);

  if (!strategy) {
    throw new Error(`Strategy not found for operation: ${operation}`);
  }

  return strategy;
}

export type Operation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "power"
  | "square_root"
  | "divisibility";
