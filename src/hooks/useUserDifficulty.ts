import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useTRPC } from "@/client/client";
import type { DifficultyType } from "@/server/db/schemas/enums";

const STORAGE_KEY = "math-difficulty";

export function useUserDifficulty() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [localDifficulty, setLocalDifficulty] = useState<DifficultyType | null>(
    null,
  );
  const [initialized, setInitialized] = useState(false);
  const savedDifficulty = useRef<DifficultyType | null>(null);

  const { data: serverSettings, isLoading } = useQuery(
    trpc.settings.getSettings.queryOptions(),
  );

  const mutation = useMutation(
    trpc.settings.updateSettings.mutationOptions({
      onSuccess: () => {
        const diff = savedDifficulty.current!;
        queryClient.setQueryData(trpc.settings.getSettings.queryKey(), {
          difficulty: diff,
        });
        setLocalDifficulty(diff);
      },
    }),
  );

  useEffect(() => {
    if (!initialized) {
      const stored = localStorage.getItem(STORAGE_KEY) as DifficultyType | null;
      if (stored && ["easy", "medium", "hard"].includes(stored)) {
        setLocalDifficulty(stored);
      }
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    if (!initialized) return;
    if (!localDifficulty && serverSettings?.difficulty) {
      setLocalDifficulty(serverSettings.difficulty);
    }
  }, [serverSettings?.difficulty, localDifficulty, initialized]);

  const difficulty = localDifficulty ?? serverSettings?.difficulty ?? "easy";

  const updateDifficulty = async (newDifficulty: DifficultyType) => {
    savedDifficulty.current = newDifficulty;
    localStorage.setItem(STORAGE_KEY, newDifficulty);
    await mutation.mutateAsync({ difficulty: newDifficulty });
  };

  return {
    difficulty: difficulty as DifficultyType,
    updateDifficulty,
    isLoading,
  };
}
