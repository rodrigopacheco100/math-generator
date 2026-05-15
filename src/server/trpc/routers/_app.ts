import { createTRPCRouter } from "../init";
import { answersRouter } from "./answers";
import { cacheRouter } from "./cache";
import { settingsRouter } from "./settings";
import { statsRouter } from "./stats";

export const appRouter = createTRPCRouter({
  stats: statsRouter,
  answers: answersRouter,
  settings: settingsRouter,
  cache: cacheRouter,
});

export type AppRouter = typeof appRouter;
