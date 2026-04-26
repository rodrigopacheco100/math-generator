import { createTRPCRouter } from "../init";
import { answersRouter } from "./answers.submitAnswer";
import { settingsRouter } from "./settings";
import { statsRouter } from "./stats.getStats";

export const appRouter = createTRPCRouter({
  stats: statsRouter,
  answers: answersRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
