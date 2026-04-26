"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { KeyButton } from "@/components/ui/key-button";
import {
  type Difficulty,
  generateProblem,
  IntegerOperations,
  type MathProblem,
  operationSymbols,
} from "@/lib/math";
import { useUserDifficulty } from "@/lib/useUserDifficulty";
import { useTRPC } from "@/trpc/client";

type Operation = IntegerOperations.Operation;

interface OperationPageClientProps {
  operation: Operation;
}

export function OperationPageClient({ operation }: OperationPageClientProps) {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [input, setInput] = useState("");
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trpc = useTRPC();

  const {
    difficulty,
    updateDifficulty,
    isLoading: settingsLoading,
  } = useUserDifficulty();

  const submitAnswer = useMutation(trpc.answers.submitAnswer.mutationOptions());

  const generateNewProblem = useCallback(() => {
    const newProblem = generateProblem(operation, difficulty);
    setProblem(newProblem);
    setInput("");
    setFeedback(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [operation, difficulty]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  const handleSubmit = async () => {
    if (!problem || !input || submitAnswer.isPending) return;

    const userAnswer = parseInt(input, 10);
    if (Number.isNaN(userAnswer)) return;

    const isCorrect = userAnswer === problem.correctAnswer;

    try {
      await submitAnswer.mutateAsync({
        operation,
        operand1: problem.operand1,
        operand2: problem.operand2,
        userAnswer,
        correctAnswer: problem.correctAnswer,
        difficulty,
      });

      if (isCorrect) {
        setFeedback("correct");
        setStreak((s) => s + 1);
      } else {
        setFeedback("wrong");
        setStreak(0);
      }

      setTimeout(generateNewProblem, 1500);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleKeyPress = (key: string) => {
    if (feedback) return;
    if (key === "DEL") {
      setInput((prev) => prev.slice(0, -1));
    } else if (key === "OK") {
      handleSubmit();
    } else {
      setInput((prev) => prev + key);
    }
  };

  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["DEL", "0", "OK"],
  ];

  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  return (
    <main className="min-h-full bg-gray-50 flex flex-col">
      <header className="bg-white px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            {operationSymbols[operation]}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-amber-500 font-semibold">
            🔥 Streak: {streak}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm mt-2">
          <span className="text-gray-500">Dificuldade:</span>
          <select
            value={difficulty}
            onChange={(e) => updateDifficulty(e.target.value as Difficulty)}
            className="text-violet-500 font-semibold bg-transparent border-none outline-none"
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {IntegerOperations.getDifficultyLabel(operation, d)}
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
              {feedback === "correct" && <div className="text-6xl mb-4">✓</div>}
              {feedback === "wrong" && <div className="text-6xl mb-4">✗</div>}
              <p className="text-5xl font-bold text-gray-800">
                {problem
                  ? `${problem.operand1} ${operationSymbols[operation]} ${problem.operand2}`
                  : "..."}
              </p>
              <p className="text-4xl font-bold text-gray-400 mt-2">= ?</p>
            </div>

            <div className="bg-gray-100 rounded-2xl p-4 mb-4">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={input}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) {
                    setInput(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="Sua resposta"
                className="w-full bg-transparent text-center text-3xl font-bold text-gray-800 outline-none placeholder:text-gray-400"
                disabled={!!feedback}
              />
            </div>
          </div>
        </div>

        <div className="px-5 pb-8">
          <div className="flex flex-col gap-2">
            {keys.map((row, i) => (
              <div key={`key_row_${i}`} className="flex gap-2">
                {row.map((key) => (
                  <KeyButton
                    key={`key_${key}`}
                    keyType={
                      key === "DEL" ? "del" : key === "OK" ? "ok" : "number"
                    }
                    onClick={() => handleKeyPress(key)}
                    className="flex-1 h-14 rounded-xl font-semibold text-xl"
                    disabled={!!feedback}
                  >
                    {key}
                  </KeyButton>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
