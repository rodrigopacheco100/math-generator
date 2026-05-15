"use client";

import { useMutation } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTRPC } from "@/client/client";
import { AnswerInput } from "@/components/math/AnswerInput";
import { NumberKeyboard } from "@/components/math/NumberKeyboard";
import { ProblemDisplay } from "@/components/math/ProblemDisplay";
import { Button } from "@/components/ui/button";
import { clearProblem, getProblem, saveProblem } from "@/hooks/useProblemCache";
import { useUserDifficulty } from "@/hooks/useUserDifficulty";
import { getStrategy } from "@/lib/math/strategies";
import type { Difficulty, MathProblem } from "@/lib/math/types";
import { translatedDifficulty } from "@/lib/math/types";

type Operation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "power"
  | "square_root"
  | "divisibility";

interface ProblemData extends MathProblem {
  correctAnswer: number | string | number[];
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
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trpc = useTRPC();

  const { difficulty, updateDifficulty } = useUserDifficulty();

  const submitAnswer = useMutation(trpc.answers.submitAnswer.mutationOptions());

  const strategy = getStrategy(operation);

  const generateNewProblem = useCallback(async () => {
    const cached = await getProblem(operation, difficulty);
    if (cached) {
      setProblem({ ...cached, correctAnswer: cached.correctAnswer });
    } else {
      const newProblem = strategy.generateProblem(difficulty);
      setProblem(newProblem);
      await saveProblem(operation, difficulty, {
        operands: newProblem.operands,
        correctAnswer: newProblem.correctAnswer,
      });
    }
    setUserAnswer(null);
    setFeedback(null);
    setShowCorrectAnswer(false);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [strategy, difficulty, operation]);

  const handleNextProblem = () => {
    generateNewProblem();
  };

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  const handleSubmit = async () => {
    if (!problem || !input || submitAnswer.isPending || !strategy) return;

    const userAnswerNum = parseInt(input, 10);
    if (Number.isNaN(userAnswerNum)) return;

    const isCorrect = userAnswerNum === problem.correctAnswer;

    setUserAnswer(input);
    clearProblem(operation, difficulty);

    try {
      await submitAnswer.mutateAsync({
        operation: operation as any,
        problem: { operands: problem.operands },
        userAnswer: { value: userAnswerNum },
        correctAnswer: { value: problem.correctAnswer as string | number },
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
        setTimeout(generateNewProblem, 2000);
      } else {
        setFeedback("wrong");
        setStreak(0);
        setShowCorrectAnswer(true);
      }
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
              disabled={showCorrectAnswer}
            />

            {showCorrectAnswer && problem && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Resposta correta:
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {Array.isArray(problem.correctAnswer)
                    ? problem.correctAnswer.sort((a, b) => a - b).join(", ")
                    : problem.correctAnswer}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-5 pb-8">
          {showCorrectAnswer ? (
            <Button
              onClick={handleNextProblem}
              className="w-full py-3"
              size="lg"
            >
              Próximo
            </Button>
          ) : (
            <NumberKeyboard onKeyPress={handleKeyPress} disabled={!!feedback} />
          )}
        </div>
      </div>
    </main>
  );
}
