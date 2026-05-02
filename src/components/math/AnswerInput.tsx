interface AnswerInputProps {
  input: string;
  userAnswer: string | null;
  feedback: "correct" | "wrong" | null;
}

export function AnswerInput({ input, userAnswer, feedback }: AnswerInputProps) {
  return (
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
  );
}
