# Development

## Prerequisites

- Node.js compatible with Angular 21.
- npm 11.x, matching the package manager declared in `package.json`.

Install dependencies with:

```bash
npm install
```

## Local Server

Start the Angular development server with:

```bash
npm start
```

Open `http://localhost:4200/`. The server uses the development Angular configuration and reloads on source changes.

## Build

Run the production build with:

```bash
npm run build
```

Angular writes output to `dist/`. Production budgets are configured in `angular.json`:

- Initial bundle warning at 500 kB and error at 1 MB.
- Any component style warning at 4 kB and error at 8 kB.

## Tests

Run unit tests with:

```bash
npm test
```

Run a focused spec with:

```bash
ng test --include="**/component-name.spec.ts"
```

The repository uses Vitest through Angular's unit-test builder. Use `vi.fn()` and Vitest assertions for new tests.

## Angular Conventions

Follow the repository's Angular conventions:

- Standalone components only.
- `ChangeDetectionStrategy.OnPush` for components.
- `inject()` for dependency injection.
- Signals for local reactive state.
- `takeUntilDestroyed` for RxJS subscriptions when subscriptions are needed.
- Strict TypeScript; avoid `any` unless there is a documented reason.
- Lazy-loaded routes by default when routes are introduced.

## Adding or Changing Sections

When adding a page section:

1. Create a standalone component under `src/app/components/<section-name>/`.
2. Keep template, SCSS, and spec files beside the component.
3. Import the component in `src/app/app.ts` if it belongs on the current landing page.
4. Add or update in-page anchors in nav only when the section is a primary user destination.
5. Run `npm run build` before handing off the change.

## Documentation Changes

Documentation content belongs in `docs/`. If new docs pages are added, update `mkdocs.yml` so the page appears in TechDocs navigation.

Keep `README.md` limited to project setup and local development usage. Put architecture, usability, operations, and contributor guidance in TechDocs pages.
