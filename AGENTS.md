<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands
```bash
pnpm dev       # development server
pnpm build     # production build
pnpm lint      # biome check
pnpm format    # biome format --write
pnpm db:generate   # drizzle-kit generate
pnpm db:migrate   # drizzle-kit migrate
pnpm db:push      # drizzle-kit push
```

## Workflow
- Mark completed tasks in `TODO.md` with `[x]`
- Lint before commit: `pnpm lint && pnpm format`

## Navigation & Routing
- **Protected Routes**: `(app)/layout.tsx` redirects to `/login` if no session
- **Main Layout**: `(app)/ClientLayout.tsx` handles responsive sidebar and mobile menu
- **Sidebar Modules**: 
  - "Operações com Números Inteiros" (unlocked): Soma, Subtração, Multiplicação, Divisão
  - "Geometria" (locked): Placeholder for future modules
- **Route Structure**:
  - `/`: Dashboard (home)
  - `/login`: Login screen
  - `/settings`: User settings
  - `/math/[operation]`: Operation pages (soma, subtracao, multiplicacao, divisao)
- **Navigation Components**: Uses `Link` from `next/link` and hooks (`usePathname`, `useRouter`) from `next/navigation`

## Critical Notes
- **Next.js 16+**: Breaking changes from older versions. Read `node_modules/next/dist/docs/` before coding
- **PWA**: Manifest at `public/manifest.json`, meta tags in layout
- **Auth**: Google via NextAuth, middleware handles protection
- **DB**: Supabase/PostgreSQL, schema in `src/db/schema.ts`
- **Math**: Operations in `src/lib/math.ts`, difficulties: easy(1-50), medium(1-100), hard(1-1000)

## Architecture
- **App Router**: Routes in `src/app/`, grouped with `(app)` for layout
- **Components**: Reusable in `src/components/`
- **Operations**: Modular pages under `src/app/(app)/math/[operation]/`
- **API**: Route handlers in `src/app/api/`
- **Lib**: Utilities in `src/lib/` (auth, env, math)
- **Types**: Custom TS in `src/types/` and `src/lib/math.ts`

## UI Components
- **Prefira sempre shadcn/ui**: Use componentes de `@/components/ui/` primeiro
- **Se não existir no shadcn**: Me pergunte antes de usar outra lib
