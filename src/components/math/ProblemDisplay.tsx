import type { MathProblem } from "@/lib/math/types";

type Operation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "power"
  | "square_root"
  | "divisibility";

const symbols: Record<string, string> = {
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
  power: "^",
  square_root: "√",
  divisibility: "÷",
};

interface ProblemDisplayProps {
  problem: MathProblem | null;
  operation: Operation;
  feedback: "correct" | "wrong" | null;
}

export function ProblemDisplay({
  problem,
  operation,
  feedback,
}: ProblemDisplayProps) {
  const formatProblemDisplay = (
    problem: MathProblem,
    operation: string,
  ): React.ReactNode => {
    if (operation === "power") {
      const superscripts = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
      const exponent = problem.operands[1]
        .toString()
        .split("")
        .map((digit) => superscripts[parseInt(digit)])
        .join("");
      return `${problem.operands[0]}${exponent} = ?`;
    }
    if (operation === "square_root") {
      return `√${problem.operands[0]} = ?`;
    }
    if (operation === "divisibility") {
      return `${problem.operands[0]} ÷ ${problem.operands[1]} = ?`;
    }
    const symbol = symbols[operation] || operation;
    return `${problem.operands[0]} ${symbol} ${problem.operands[1]} = ?`;
  };

  return (
    <div
      className={`rounded-2xl p-8 text-center mb-5 ${
        feedback === "correct"
          ? "bg-emerald-100"
          : feedback === "wrong"
            ? "bg-red-100"
            : "bg-white"
      }`}
    >
      <p className="text-3xl font-bold text-gray-800">
        {problem ? formatProblemDisplay(problem, operation) : "..."}
      </p>
    </div>
  );
}
