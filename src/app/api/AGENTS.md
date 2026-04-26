# API Layer - Patterns & Conventions

## tRPC (Default)

- **Location**: `src/trpc/` + `src/app/api/trpc/[trpc]/route.ts`
- **Strategy**:
  - 1 file per procedure (SRP)
  - Grouping by domain in subfolders
  - protectedProcedure for authenticated routes
  - 'server-only' in all server files
  - Validation in each procedure

## File Structure

```
src/trpc/
├── init.ts                    # tRPC init + createTRPCContext
├── query-client.ts           # QueryClient factory
├── client.tsx               # TRPCReactProvider + hooks
├── server.ts                # Prefetch helpers (server-only)
└── routers/
    ├── _app.ts             # Root router (merge)
    ├── _app.helpers.ts     # HydrateClient, prefetch
    ├── stats.getStats.ts   # 1 procedure = 1 file
    └── answers.submitAnswer.ts
```

## Protected Routes

- Middleware allows `/api/trpc/*` (public)
- **protectedProcedure validates auth in each procedure**
- Use baseProcedure only for public endpoints

## Auth Pattern

```typescript
// init.ts
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx });
});
```

## Migration Notes

- Keep REST APIs during transition
- Migrate components to tRPC hooks
- Remove REST routes after full migration