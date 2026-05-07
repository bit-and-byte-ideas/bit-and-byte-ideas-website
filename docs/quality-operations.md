# Quality and Operations

## Required Checks

Run the production build before completing code changes:

```bash
npm run build
```

Run unit tests when behavior, components, services, or configuration changes:

```bash
npm test
```

For documentation-only changes, verify that `mkdocs.yml` navigation matches the files in `docs/`.

## Testing Strategy

Component specs live beside their components. Service specs live beside services.

Use focused tests for:

- Rendered content that users depend on.
- Services that centralize shared business information.
- UI state such as the nav scrolled state.
- Any future form, routing, or integration behavior.

Avoid brittle tests that only restate static markup unless the text is a business-critical claim or conversion path.

## Build and Deployment Assumptions

The Angular production build is configured through `angular.json`. The repository does not currently define a deployment workflow.

TODO: Document the production hosting provider, deployment trigger, environment ownership, and rollback process once those decisions are available.

## External Dependencies

The browser page depends on:

- Google Fonts loaded from `src/index.html`.
- Calendly widget CSS and JavaScript loaded from `src/index.html`.
- Calendly inline widget URL configured in the booking component.

If either provider changes, test the page in a browser to confirm fonts and booking still load correctly.

## Operational Risks

- Calendly is a third-party runtime dependency and can affect booking availability.
- Contact email changes must be made in `BusinessInfoService`.
- Static assets under `public/` are part of the brand presentation and should not be renamed without updating references.
- The current route table is empty; adding routes changes navigation, deep-linking, and deployment fallback requirements.

## TechDocs Publishing

Backstage TechDocs expects:

- `catalog-info.yaml` with `backstage.io/techdocs-ref: dir:.`
- `mkdocs.yml` at the repository root.
- Markdown content in `docs/`.

Preview TechDocs locally, when the TechDocs CLI is available, with:

```bash
npx @techdocs/cli serve
```

TODO: Confirm whether this repository's CI should publish generated TechDocs artifacts or rely on Backstage to build documentation from source.
