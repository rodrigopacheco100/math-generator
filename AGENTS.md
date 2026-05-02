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
pnpm typecheck # tsc --noEmit
pnpm db:generate   # drizzle-kit generate
pnpm db:migrate   # drizzle-kit migrate
pnpm db:push      # drizzle-kit push
pnpm db:studio    # drizzle-kit studio
```

## Workflow
- Mark completed tasks in `TODO.md` with `[x]`
- Lint before commit: `pnpm lint && pnpm format && pnpm typecheck`
- Use docker-compose for local PostgreSQL testing

## Navigation & Routing
- **Protected Routes**: `(app)/layout.tsx` redirects to `/login` if no session
- **Main Layout**: `(app)/ClientLayout.tsx` handles responsive sidebar and mobile menu
- **Sidebar Modules**: 
  - "Operações com Números Inteiros" (unlocked): Soma, Subtração, Multiplicação, Divisão, Divisibilidade
  - "Potência" (unlocked): Potência, Raiz Quadrada
  - "Geometria" (locked): Placeholder for future modules
- **Route Structure**:
  - `/`: Dashboard (home)
  - `/login`: Login screen
  - `/settings`: User settings
  - `/math/[operation]`: Operation pages (soma, subtracao, multiplicacao, divisao, divisibilidade, potencia, raiz_quadrada)
- **Navigation Components**: Uses `Link` from `next/link` and hooks (`usePathname`, `useRouter`) from `next/navigation`

## Critical Notes
- **Next.js 16+**: Breaking changes from older versions. Read `node_modules/next/dist/docs/` before coding
- **PWA**: Manifest at `public/manifest.json`, meta tags in layout
- **Auth**: Google via NextAuth, middleware handles protection
- **DB**: PostgreSQL with Docker, schema in `src/server/db/schemas/`
- **Math**: Operations in `src/lib/math/strategies/`, difficulties: easy(1-50), medium(1-100), hard(1-1000)
- **TRPC**: API layer with type-safe procedures
- **Drizzle ORM**: Database toolkit with migrations

## Architecture
- **App Router**: Routes in `src/app/`, grouped with `(app)` for layout
- **Components**: Reusable in `src/components/`
  - Math components: `src/components/math/`
  - UI components: `@/components/ui/` (shadcn)
- **Operations**: Modular pages under `src/app/(app)/math/[operation]/`
- **API**: TRPC routers in `src/server/trpc/routers/`
- **Lib**: Utilities in `src/lib/` (auth, env, math strategies)
- **Types**: Custom TS in `src/lib/math/types.ts`
- **Database**: PostgreSQL with Drizzle ORM in `src/server/db/`

## Math Operations System
- **Strategy Pattern**: Each operation implements `MathStrategy` interface
- **Supported Operations**:
  - Arithmetic: addition, subtraction, multiplication, division
  - Power: power, square_root
  - Divisibility: Multiple divisor selection with array answers
- **Difficulty Levels**: easy (1-50), medium (1-100), hard (1-1000)
- **Answer Storage**: Consistent `{ value: ... }` format in JSONB
- **Validation**: Operation-specific Zod schemas with discriminated unions

## UI Components
- **Prefira sempre shadcn/ui**: Use componentes de `@/components/ui/` primeiro para construção de interfaces
- **Se não existir no shadcn**: Me pergunte antes de usar outra lib
- **Importância do shadcn/ui**: 
  - Componentes testados e acessíveis
  - CVA (Class Variance Authority) para gerenciamento de classes
  - Type safety com TypeScript
  - Design system consistente
  - Facilidade de manutenção e extensibilidade
- **Custom Components** (apenas quando necessário):
  - `ProblemDisplay`: Shows math problems with operation symbols
  - `AnswerInput`: Handles user input with feedback
  - `NumberKeyboard`: Numeric input for mobile
  - `DivisibilitySelector`: Multi-select for divisor problems
- **Componentes shadcn/ui disponíveis**:
  - `Button`: Botões com variantes (default, outline, secondary, ghost, destructive, link)
  - `Input`, `Select`, `Checkbox`, `Radio`: Form controls
  - `Card`, `Dialog`, `Sheet`: Layout e modais
  - `Badge`, `Avatar`, `Skeleton`: UI elements
  - `Table`, `Tabs`, `Accordion`: Data display

## User Experience Features
- **Feedback System**: Visual feedback for correct/incorrect answers
- **Show Correct Answer**: Displays solution after wrong attempts
- **Next Problem Button**: Manual progression after errors
- **Streak Tracking**: Fire emoji animation for consecutive correct answers
- **Confetti Celebration**: Confetti animation on every correct answer
- **Responsive Design**: Mobile-first with touch-friendly interfaces

## Database Schema
- **Users**: Authentication and profile data
- **Answers**: Problem responses with operation, difficulty, and correctness
- **User Settings**: Difficulty preferences and customization
- **JSONB Storage**: Flexible answer format for different operation types
- **Migration System**: Drizzle migrations with custom SQL support

## Development Environment
- **Local Database**: Docker Compose with PostgreSQL
  - Connection: `postgresql://postgres:postgres@localhost:5432/math_generator`
- **Package Manager**: pnpm with workspace configuration
- **Linting**: Biome for code formatting and linting
- **Type Checking**: TypeScript strict mode
- **Git Hooks**: Husky for pre-commit validation

## Key Files & Directories
- `src/lib/math/strategies/`: Math operation implementations
- `src/components/math/`: Math-specific UI components
- `src/server/trpc/routers/`: API route handlers
- `src/server/db/schemas/`: Database schema definitions
- `drizzle/`: Database migrations
- `docker-compose.yml`: Local development database
