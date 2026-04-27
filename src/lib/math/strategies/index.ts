import type { MathStrategy } from "./base";
import { BinaryStrategy } from "./binary";

const strategies = new Map<string, MathStrategy>();

strategies.set("addition", new BinaryStrategy("addition"));
strategies.set("subtraction", new BinaryStrategy("subtraction"));
strategies.set("multiplication", new BinaryStrategy("multiplication"));
strategies.set("division", new BinaryStrategy("division"));

export function getStrategy(operation: string): MathStrategy | undefined {
  return strategies.get(operation);
}

export function hasStrategy(operation: string): boolean {
  return strategies.has(operation);
}

export function registerStrategy(
  strategy: MathStrategy,
  operation: string,
): void {
  strategies.set(operation, strategy);
}

export { BinaryStrategy };
export type { DifficultyConfig, MathStrategy } from "./base";

export type Operation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division";
