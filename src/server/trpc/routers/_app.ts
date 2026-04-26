import { createTRPCRouter } from "../init";
import { answersRouter } from "./answers";
import { settingsRouter } from "./settings";
import { statsRouter } from "./stats";

export const appRouter = createTRPCRouter({
  stats: statsRouter,
  answers: answersRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
