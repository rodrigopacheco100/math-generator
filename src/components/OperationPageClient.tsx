"use client";

import { useMutation } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTRPC } from "@/client/client";
import { useUserDifficulty } from "@/hooks/useUserDifficulty";
import { getStrategy } from "@/lib/math/strategies";
import type { Difficulty, MathProblem } from "@/lib/math/types";
import { translatedDifficulty } from "@/lib/math/types";
import { AnswerInput } from "@/components/math/AnswerInput";
import { NumberKeyboard } from "@/components/math/NumberKeyboard";
import { ProblemDisplay } from "@/components/math/ProblemDisplay";

type Operation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "power"
  | "square_root";

interface ProblemData extends MathProblem {
  correctAnswer: number | string;
}

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
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [input, setInput] = useState("");
  const [streak, setStreak] = useState(0);
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trpc = useTRPC();

  const { difficulty, updateDifficulty } = useUserDifficulty();

  const submitAnswer = useMutation(trpc.answers.submitAnswer.mutationOptions());

  const strategy = getStrategy(operation);

  const generateNewProblem = useCallback(() => {
    if (!strategy) return;

    const newProblem = strategy.generateProblem(difficulty);
    setProblem(newProblem);
    setInput("");
    setFeedback(null);
    setUserAnswer(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [strategy, difficulty]);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  const handleSubmit = async () => {
    if (!problem || !input || submitAnswer.isPending || !strategy) return;

    const userAnswerNum = parseInt(input, 10);
    if (Number.isNaN(userAnswerNum)) return;

    const isCorrect = userAnswerNum === problem.correctAnswer;

    setUserAnswer(input);

    try {
      await submitAnswer.mutateAsync({
        operation,
        problem: { operands: problem.operands },
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
                {translatedDifficulty[d]}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-5">
          <div className="w-full max-w-sm">
            <ProblemDisplay
              problem={problem}
              operation={operation}
              feedback={feedback}
            />
            <AnswerInput
              input={input}
              userAnswer={userAnswer}
              feedback={feedback}
            />
          </div>
        </div>

        <div className="px-5 pb-8">
          <NumberKeyboard onKeyPress={handleKeyPress} disabled={!!feedback} />
        </div>
      </div>
    </main>
  );
}
