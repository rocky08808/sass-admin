# Project Harness & Architecture Rules (Ant Design v5 Edition)

## 1. Tech Stack & Strict Constraints
- **Core**: React 19, TypeScript (Strict Mode), Vite.
- **UI Library**: Ant Design v5 (`antd` + `@ant-design/icons`).
  - STRICTLY use Ant Design v5 APIs (e.g., use `open` instead of deprecated `visible` on Drawer/Modal; use `App.useApp()` or static `message` cleanly).
  - DO NOT install or mix Tailwind CSS. Use antd `Layout`, `Flex`, `Space`, `Card`, `Typography`, and `theme.useToken()` for layout and styling.
- **Data Fetching**: `@tanstack/react-query`. All HTTP calls MUST reside in `src/features/<module>/api.ts`.
- **Contract & Validation**: `zod` schemas in `src/schemas/` are the single source of truth for API payloads and TypeScript types.
- **Mocking**: MSW (`src/mocks/`). Every endpoint MUST have a stateful MSW handler supporting GET, POST, PUT, DELETE.

## 2. Public Component Reuse Mandate (CRITICAL)
To maximize reuse and keep UI consistent across modules:
- **Tables**: All list views MUST use `src/components/shared/CrudTable.tsx` (a reusable wrapper around antd `<Table />` providing keyword search, pagination, loading state, and standardized Edit / Popconfirm-Delete actions).
- **Forms**: All Create/Edit flows MUST use `src/components/shared/CrudFormDrawer.tsx` (a reusable wrapper around antd `<Drawer />` + `<Form />` handling initialValues, validation, and submit loading state).

## 3. Fast Frontend-Backend Collaboration Rule
Follow Contract-First development for any new module:
1. Define Zod schemas & TS types in `src/schemas/<domain>.schema.ts`.
2. Add stateful mock data and RESTful handlers in `src/mocks/db.ts` & `src/mocks/handlers.ts`.
3. Build React Query hooks (`api.ts`) and UI pages consuming `CrudTable` and `CrudFormDrawer`.

## 4. Testing & Definition of Done (Verification)
- **AntD Test Setup**: `src/test/setup.ts` MUST polyfill `window.matchMedia`, `ResizeObserver`, and `window.getComputedStyle` so antd v5 components render without errors in jsdom.
- **Verification Gate**: Before concluding ANY task, you MUST execute:
  `npm run verify`
  (Runs `tsc --noEmit`, `biome check`, and `vitest run`). Zero errors or warnings allowed.

## 5. Advanced Harness Guardrails (Architecture & DevTools)
- **Architecture Fitness Tests**: `src/test/architecture.test.ts` MUST exist and run as part of `npm run test`. It statically scans `src/features/` to enforce:
  1. Every feature module has a corresponding `src/schemas/<module>.schema.ts` and `*.test.tsx`.
  2. Feature UI files MUST NOT import `Table` or `Drawer` directly from `antd` (must use `CrudTable` and `CrudFormDrawer`).
  3. Direct `fetch(` calls are forbidden outside `api.ts` files.
- **Mock DevTools & Env Switch**:
  - Support `VITE_ENABLE_MOCK` env flag (default `true` in `.env.example`).
  - Include a subtle `MockControlBadge` component in the top-right header when Mock is active, allowing 1-click **Reset Mock DB** and toggling **Simulated Latency (500ms)**.
