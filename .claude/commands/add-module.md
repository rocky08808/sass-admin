Create a new Ant Design v5 CRUD business module named `$ARGUMENTS` strictly following `AGENTS.md`:
1. Define Zod schemas (Entity, CreateDTO, UpdateDTO) in `src/schemas/$ARGUMENTS.model.schema.ts`. In `src/schemas/$ARGUMENTS.schema.ts`, re-export them and export `apiContract` (follow `tenants.schema.ts`), then register that contract in `src/components/shared/ApiContractModal.tsx`.
2. Add stateful mock data and `/api/$ARGUMENTS` CRUD handlers in `src/mocks/db.ts` and `src/mocks/handlers.ts`.
3. Create `src/features/$ARGUMENTS/` with `api.ts`, `columns.tsx`, `<Name>FormFields.tsx`, and `<Name>Page.tsx` (`<Name>` is the PascalCase form of the module name) reusing `CrudTable` and `CrudFormDrawer`.
4. Register the route and Menu item in `src/App.tsx`.
5. Add an integration test in `src/features/$ARGUMENTS/<Name>Page.test.tsx` verifying table rendering and item creation.
6. Run `npm run verify` and resolve all issues until passing.
