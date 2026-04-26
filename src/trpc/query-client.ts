import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export const getQueryClient = cache(makeQueryClient);
