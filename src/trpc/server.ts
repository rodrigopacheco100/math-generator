import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createTRPCContext } from "./init";
import { getQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
