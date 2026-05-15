import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { Operation } from "@/lib/math/strategies";
import type { Difficulty } from "@/lib/math/types";
import type { AppRouter } from "@/server/trpc/routers/_app";

interface CachedProblem {
  operands: number[];
  correctAnswer: number | string | number[];
  timestamp: number;
}

function getCacheKey(operation: Operation, difficulty: Difficulty): string {
  return `math-problem-${operation}-${difficulty}`;
}

function getTRPCClient() {
  return createTRPCClient<AppRouter>({
    links: [httpBatchLink({ url: "/api/trpc" })],
  });
}

async function encryptData(data: string): Promise<string> {
  const client = getTRPCClient();
  const result = await client.cache.encrypt.mutate({ data });
  return result.ciphertext;
}

async function decryptData(ciphertext: string): Promise<string | null> {
  try {
    const client = getTRPCClient();
    const result = await client.cache.decrypt.mutate({ ciphertext });
    return result.plaintext;
  } catch {
    return null;
  }
}

export async function saveProblem(
  operation: Operation,
  difficulty: Difficulty,
  problem: { operands: number[]; correctAnswer: number | string | number[] },
): Promise<void> {
  const key = getCacheKey(operation, difficulty);
  const cached: CachedProblem = {
    operands: problem.operands,
    correctAnswer: problem.correctAnswer,
    timestamp: Date.now(),
  };
  try {
    const encrypted = await encryptData(JSON.stringify(cached));
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error("Error saving problem to cache:", error);
  }
}

export async function getProblem(
  operation: Operation,
  difficulty: Difficulty,
): Promise<{
  operands: number[];
  correctAnswer: number | string | number[];
} | null> {
  const key = getCacheKey(operation, difficulty);
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const decrypted = await decryptData(stored);
    if (!decrypted) return null;

    const parsed: CachedProblem = JSON.parse(decrypted);
    if (!parsed.operands || parsed.correctAnswer === undefined) return null;

    return {
      operands: parsed.operands,
      correctAnswer: parsed.correctAnswer,
    };
  } catch (error) {
    console.error("Error reading problem from cache:", error);
    return null;
  }
}

export function clearProblem(
  operation: Operation,
  difficulty: Difficulty,
): void {
  const key = getCacheKey(operation, difficulty);
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing problem cache:", error);
  }
}
