"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRef, useState } from "react";
import { useTRPC } from "@/client/client";
import { SelectCard } from "@/components/ui/select-card";
import { translatedDifficulty } from "@/lib/math/types";
import type { DifficultyType } from "@/server/db/schemas/enums";

const difficulties: DifficultyType[] = ["easy", "medium", "hard"];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyType | null>(null);
  const savedDifficulty = useRef<DifficultyType | null>(null);

  const { data: settings, isLoading } = useQuery(
    trpc.settings.getSettings.queryOptions(),
  );

  const mutation = useMutation(
    trpc.settings.updateSettings.mutationOptions({
      onSuccess: () => {
        const diff = savedDifficulty.current!;
        queryClient.setQueryData(trpc.settings.getSettings.queryKey(), {
          difficulty: diff,
        });
        localStorage.setItem("math-difficulty", diff);
        setSelectedDifficulty(null);
      },
    }),
  );

  const currentDifficulty =
    selectedDifficulty ?? settings?.difficulty ?? "easy";
  const hasChanged =
    selectedDifficulty !== null && selectedDifficulty !== settings?.difficulty;

  const handleSave = () => {
    if (selectedDifficulty) {
      savedDifficulty.current = selectedDifficulty;
      mutation.mutate({ difficulty: selectedDifficulty });
    }
  };

  return (
    <main className="min-h-full bg-gray-50">
      <header className="bg-white px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
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
          <h1 className="text-xl font-bold text-gray-800">Configurações</h1>
        </div>
      </header>

      <div className="px-5 py-4">
        <h2 className="text-base font-semibold text-gray-800 mb-3">
          Dificuldade
        </h2>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-xl h-14 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2 mb-4">
              {difficulties.map((d) => (
                <SelectCard
                  key={d}
                  variant={d}
                  selected={currentDifficulty === d}
                  onClick={() => setSelectedDifficulty(d)}
                  className="flex items-center justify-start gap-3 p-4 rounded-xl h-auto cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 rounded-full ${
                      currentDifficulty === d ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  />
                  <span className="text-gray-800 font-medium">
                    {translatedDifficulty[d]}
                  </span>
                </SelectCard>
              ))}
            </div>

            <button
              onClick={handleSave}
              type="button"
              disabled={!hasChanged || mutation.isPending}
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                hasChanged
                  ? "bg-violet-500 text-white hover:bg-violet-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
