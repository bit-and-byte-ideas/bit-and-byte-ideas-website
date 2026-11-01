# Bit and Byte Ideas Website

The public website for Bit and Byte Ideas, a software studio based in San Diego, CA
offering website and application development, business automation and integrations, and
maintenance plus hosting support for small and medium businesses across the United States.

Built with Vite + React 19 + React Router 8 (framework mode, statically prerendered) and
served from Azure Static Web Apps. See [`docs/`](docs/index.md) for full contributor
documentation.

## Requirements

- Node.js 24.x
- pnpm, via Corepack: `corepack enable pnpm`

## Setup

```bash
pnpm install
pre-commit install --hook-type pre-commit --hook-type commit-msg
```

## Local Development

```bash
pnpm dev
```

The dev server runs at `http://localhost:5173/` with HMR.

## Build

```bash
pnpm build
```

Type-checks (`tsc -b`, gating), runs `react-router build`, generates `sitemap.xml`, and
moves inline scripts into same-origin files so the strict CSP holds.
Static output — including prerendered HTML for every route — is written to
`build/client/`.

## Tests

```bash
pnpm test      # Vitest unit suite
pnpm test:e2e  # Playwright end-to-end suite (dev server)
pnpm build && pnpm test:e2e:built  # same journeys against the build with production headers
```

Run a focused unit test file (or a glob) with:

```bash
pnpm test hero.test.tsx
```

## Lint

```bash
pnpm lint
```

See [`docs/development.md`](docs/development.md) for conventions, TypeScript layout, and
commit hygiene, and [`docs/quality-operations.md`](docs/quality-operations.md) for CI,
deployment, and rollback.
