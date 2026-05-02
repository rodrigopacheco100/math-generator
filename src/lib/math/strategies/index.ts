import type { MathStrategy } from "./base";
import { BinaryStrategy } from "./binary";
import { DivisibilityStrategy } from "./divisibility";
import { PowerStrategy, SquareRootStrategy } from "./power";

const strategies = new Map<string, MathStrategy>();

strategies.set("addition", new BinaryStrategy("addition"));
strategies.set("subtraction", new BinaryStrategy("subtraction"));
strategies.set("multiplication", new BinaryStrategy("multiplication"));
strategies.set("division", new BinaryStrategy("division"));
strategies.set("power", new PowerStrategy());
strategies.set("square_root", new SquareRootStrategy());
strategies.set("divisibility", new DivisibilityStrategy());

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
  | "division"
  | "power"
  | "square_root"
  | "divisibility";
