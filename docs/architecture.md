# Architecture

## Stack

- Angular 21 standalone application.
- TypeScript with strict Angular compiler settings.
- SCSS for global and component-level styles.
- Angular signals for small reactive UI state.
- Vitest through the Angular unit-test builder.
- Static assets served from `public/`.

## Application Entry Point

The browser entry point is `src/main.ts`. It bootstraps the standalone `App` component with providers from `src/app/app.config.ts`.

`app.config.ts` currently provides:

- `provideBrowserGlobalErrorListeners()`
- `provideRouter(routes)`

The route table in `src/app/app.routes.ts` is empty because the current site is a single landing page composed directly by the root component.

## Component Composition

`src/app/app.ts` imports and renders the major page sections in `src/app/app.html`:

- `Nav`
- `Hero`
- `Services`
- `Booking`
- `Contact`
- `Footer`

Each page section is a standalone component using `ChangeDetectionStrategy.OnPush`. Components keep their template, styles, and tests together under `src/app/components/<section>/`.

## Data Flow

Most page content is static and owned by the component that renders it.

Shared business contact data is centralized in `BusinessInfoService`:

- Email address.
- Expected response time.
- Availability.
- Target customer segment.
- Derived `mailto:` link.

Use this service when a component needs business contact information so the site does not drift across sections.

## Styling

Global reset rules, design tokens, fonts, body defaults, and the shared `.container` layout utility live in `src/styles.scss`.

Component SCSS files own section-specific layout and visual treatment. Prefer local component styles for new section work unless the style is a true site-wide token or primitive.

The visual direction is a dark, high-contrast software-studio brand using blue and green accents, display typography, and sharp geometry. Preserve the established direction when adding or changing page sections.

## Assets and External Resources

Static assets live in `public/` and are copied by Angular's build configuration:

- `public/assets/bit_byte_ideas_full_logo.png`
- `public/assets/BandBIdeas-Icon-small.png`
- `public/BandBIdeas.ico`
- `public/favicon.ico`

`src/index.html` loads Google Fonts and Calendly's widget script and stylesheet. The booking component provides the Calendly inline widget URL.

## Routing

The site currently uses anchor links for in-page navigation:

- `#services`
- `#booking`
- `#contact`

Add Angular routes only when the site grows beyond a single-page experience. Prefer lazy-loaded routes for new page-level features.

## Backstage TechDocs

TechDocs configuration is provided by:

- `mkdocs.yml`
- `catalog-info.yaml`
- Markdown files in `docs/`

`catalog-info.yaml` includes the `backstage.io/techdocs-ref: dir:.` annotation so Backstage can generate documentation from this repository root.
