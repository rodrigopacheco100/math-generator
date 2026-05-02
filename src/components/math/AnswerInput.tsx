import { cva } from "class-variance-authority";

interface AnswerInputProps {
  input: string;
  userAnswer: string | null;
  feedback: "correct" | "wrong" | null;
  disabled?: boolean;
}

const answerInputVariants = cva("bg-gray-100 rounded-2xl p-4 mb-4", {
  variants: {
    feedback: {
      correct: "bg-emerald-100",
      wrong: "bg-red-100",
      null: "",
    },
    disabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    feedback: null,
    disabled: false,
  },
});

export function AnswerInput({
  input,
  userAnswer,
  feedback,
  disabled,
}: AnswerInputProps) {
  return (
    <div className={answerInputVariants({ feedback, disabled })}>
      <p className="w-full bg-transparent text-center text-3xl font-bold text-gray-800">
        {userAnswer || input || "?"}
      </p>
    </div>
  );
}
