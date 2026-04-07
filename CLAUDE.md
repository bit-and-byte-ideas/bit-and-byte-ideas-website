# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for Bit and Byte Ideas, built with Angular. The Angular project has not yet been scaffolded — use the `angular-developer` skill when initializing it.

## Common Commands

Once the Angular project is initialized, use these commands from the project root:

```bash
ng serve                        # Dev server (http://localhost:4200)
ng build                        # Production build
ng build --configuration production  # Production build with bundle size verification
ng test                         # Run unit tests
ng test --watch                 # Watch mode
ng test --code-coverage         # With coverage report
ng generate component <name>    # Scaffold component
ng generate service <name>      # Scaffold service
```

Run a single test file by passing the spec file path or a grep pattern:
```bash
ng test --include="**/foo.spec.ts"
```

After generating any code, always run `ng build` to verify there are no build errors before proceeding.

## Architecture Expectations

This project uses Angular 17+ conventions enforced by the installed skills:

- **Standalone components only** — no NgModule-based components
- **OnPush change detection** on all components
- **Signals** for reactive state (`signal`, `computed`, `linkedSignal`, `resource`)
- **Signal Forms** for new forms (Angular v21+); reactive/template-driven for existing forms
- **`inject()`** function for dependency injection (not constructor injection)
- **`takeUntilDestroyed`** for RxJS subscription cleanup
- **Lazy-loaded routes** by default; eager only where justified
- **Strict TypeScript** — avoid `any` without justification
- **Vitest** for unit testing (not Jasmine); use `vi.fn()` for mocks

## Available Skills

Use these skills (via the Skill tool or slash commands) for their respective tasks:

| Skill | When to use |
|-------|-------------|
| `angular-developer` | Creating components/services, routing, DI, forms, styling, animations, SSR, CLI usage |
| `angular-architect` | NgRx state management, RxJS patterns, bundle optimization, enterprise architecture |
| `angular-testing` | Writing unit/integration tests with Vitest and TestBed |
| `frontend-design` | Designing distinctive, production-quality UI with intentional aesthetics |

## Design Direction

When building UI, use the `frontend-design` skill. Avoid generic AI aesthetics: no Inter/Roboto/Arial fonts, no purple gradients on white, no cookie-cutter layouts. Commit to a bold, context-specific aesthetic direction.
