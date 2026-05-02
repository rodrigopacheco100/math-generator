"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTRPC } from "@/client/client";
import { DivisibilitySelector } from "@/components/math/DivisibilitySelector";
import { useUserDifficulty } from "@/hooks/useUserDifficulty";
import { getStrategy } from "@/lib/math/strategies";
import type { Difficulty, MathProblem } from "@/lib/math/types";
import { translatedDifficulty } from "@/lib/math/types";

interface ProblemData extends MathProblem {
  correctAnswer: string | number | number[];
}

export function DivisibilityPageClient() {
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [selectedDivisors, setSelectedDivisors] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trpc = useTRPC();

  const { difficulty, updateDifficulty } = useUserDifficulty();
  const submitAnswer = useMutation(trpc.answers.submitAnswer.mutationOptions());

  const strategy = getStrategy("divisibility");

  const generateNewProblem = useCallback(() => {
    if (!strategy) return;

    const newProblem = strategy.generateProblem(difficulty);
    setProblem(newProblem);
    setSelectedDivisors([]);
    setFeedback(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [strategy, difficulty]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  const handleSubmit = async () => {
    if (
      !problem ||
      selectedDivisors.length === 0 ||
      submitAnswer.isPending ||
      !strategy
    )
      return;

    try {
      await submitAnswer.mutateAsync({
        operation: "divisibility",
        problem: { operands: problem.operands },
        userAnswer: { value: selectedDivisors },
        correctAnswer: { value: problem.correctAnswer as number[] },
        difficulty,
      });

      const isCorrect = strategy?.checkAnswer(
        problem,
        { value: selectedDivisors },
        problem.correctAnswer,
      );

      if (isCorrect) {
        setFeedback("correct");
      } else {
        setFeedback("wrong");
      }

      setTimeout(generateNewProblem, 2000);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleDivisorToggle = (divisor: number) => {
    setSelectedDivisors((prev) =>
      prev.includes(divisor)
        ? prev.filter((d) => d !== divisor)
        : [...prev, divisor],
    );
  };

  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  return (
    <main className="min-h-full bg-gray-50 flex flex-col">
      <header className="bg-white px-5 pt-6 pb-4">
        <div className="flex items-center gap-2 text-sm mt-2">
          <span className="text-gray-500">Dificuldade:</span>
          <select
            value={difficulty}
            onChange={(e) => updateDifficulty(e.target.value as Difficulty)}
            className="text-violet-500 font-semibold bg-transparent border-none outline-none"
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {translatedDifficulty[d]}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-5">
          <div className="w-full max-w-sm">
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
                {problem ? strategy?.formatProblem(problem) : "..."}
              </p>
            </div>

            <DivisibilitySelector
              number={problem?.operands[0] || 0}
              selectedDivisors={selectedDivisors}
              onDivisorToggle={handleDivisorToggle}
            />
          </div>
        </div>

        <div className="px-5 pb-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedDivisors.length === 0 || !!feedback}
            className="w-full py-3 px-4 bg-violet-600 text-white rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Verificar
          </button>
        </div>
      </div>
    </main>
  );
}
