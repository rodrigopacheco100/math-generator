"use client";

import { useMutation } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTRPC } from "@/client/client";
import { KeyButton } from "@/components/ui/key-button";
import { useUserDifficulty } from "@/hooks/useUserDifficulty";
import {
  type Difficulty,
  generateProblem,
  IntegerOperations,
  type MathProblem,
  operationSymbols,
} from "@/lib/math";

type Operation = IntegerOperations.Operation;

interface OperationPageClientProps {
  operation: Operation;
}

const COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6BFF",
  "#FF9F43",
];

function fireConfetti() {
  const particleCount = 60;
  const gravity = 0.9;
  const ticks = 300;
  const shapes: ("square" | "circle")[] = ["square", "circle"];

  confetti({
    particleCount,
    gravity,
    ticks,
    shapes,
    colors: COLORS,
    origin: { x: 0.5, y: 1.05 },
    angle: 90,
    spread: 70,
    startVelocity: 55,
  });

  confetti({
    particleCount,
    gravity,
    ticks,
    shapes,
    colors: COLORS,
    origin: { x: 0, y: 0.8 },
    angle: 60,
    spread: 55,
    startVelocity: 50,
  });

  confetti({
    particleCount,
    gravity,
    ticks,
    shapes,
    colors: COLORS,
    origin: { x: 1, y: 0.8 },
    angle: 120,
    spread: 55,
    startVelocity: 50,
  });

  confetti({
    particleCount,
    gravity,
    ticks,
    shapes,
    colors: COLORS,
    origin: { x: 0, y: 1.05 },
    angle: 75,
    spread: 50,
    startVelocity: 52,
  });

  confetti({
    particleCount,
    gravity,
    ticks,
    shapes,
    colors: COLORS,
    origin: { x: 1, y: 1.05 },
    angle: 105,
    spread: 50,
    startVelocity: 52,
  });
}

export function OperationPageClient({ operation }: OperationPageClientProps) {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [input, setInput] = useState("");
  const [streak, setStreak] = useState(0);
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
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
    setUserAnswer(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [operation, difficulty]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  const handleSubmit = async () => {
    if (!problem || !input || submitAnswer.isPending) return;

    const userAnswerNum = parseInt(input, 10);
    if (Number.isNaN(userAnswerNum)) return;

    const isCorrect = userAnswerNum === problem.correctAnswer;

    setUserAnswer(input);

    try {
      await submitAnswer.mutateAsync({
        operation,
        operand1: problem.operand1,
        operand2: problem.operand2,
        userAnswer: userAnswerNum,
        correctAnswer: problem.correctAnswer,
        difficulty,
      });

      if (isCorrect) {
        setFeedback("correct");
        setStreak((s) => {
          const newStreak = s + 1;
          setStreakAnimation(true);
          setTimeout(() => setStreakAnimation(false), 500);
          return newStreak;
        });
        fireConfetti();
      } else {
        setFeedback("wrong");
        setStreak(0);
      }

      setTimeout(generateNewProblem, 2000);
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
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`font-semibold transition-transform duration-300 ${
              streakAnimation ? "scale-125" : ""
            }`}
          >
            <span
              className={streakAnimation ? "animate-bounce inline-block" : ""}
            >
              🔥
            </span>{" "}
            Streak: {streak}
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
              <p className="text-5xl font-bold text-gray-800">
                {problem
                  ? `${problem.operand1} ${operationSymbols[operation]} ${problem.operand2}`
                  : "..."}
              </p>
              <p className="text-4xl font-bold text-gray-400 mt-2">= ?</p>
            </div>

            <div
              className={`bg-gray-100 rounded-2xl p-4 mb-4 ${
                feedback === "correct"
                  ? "bg-emerald-100"
                  : feedback === "wrong"
                    ? "bg-red-100"
                    : ""
              }`}
            >
              <p className="w-full bg-transparent text-center text-3xl font-bold text-gray-800">
                {userAnswer || input || "?"}
              </p>
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
