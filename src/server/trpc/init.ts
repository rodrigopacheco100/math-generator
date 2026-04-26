import { initTRPC, TRPCError } from "@trpc/server";
import type { Session } from "next-auth";
import { auth } from "../auth/auth";

export interface TRPCContext {
  session: Session | null;
}

export interface ProtectedTRPCContext {
  session: Session;
}

export const createTRPCContext = async (): Promise<TRPCContext> => {
  const session = await auth();
  return { session };
};

const t = initTRPC.context<TRPCContext>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({ ctx: ctx as ProtectedTRPCContext });
});
