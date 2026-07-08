# Bit and Byte Ideas Website

This repository contains the public website for Bit and Byte Ideas, a software studio based
in San Diego, CA focused on static website development, web application development, and
maintenance plus hosting support for small and medium businesses across the United States.

The site is a Vite + React 19 application using React Router 7 framework mode with static
prerendering: every route ships as real HTML at build time and is served from Azure Static
Web Apps. It is a marketing and lead-generation site with three routes: the home page,
`/about`, and a branded 404.

## What the Site Does

- Introduces Bit and Byte Ideas as a software studio.
- Explains three service lines: static websites, web applications, and maintenance plus hosting.
- Answers common buyer questions in an FAQ (with FAQPage structured data).
- Presents the founder's background on `/about` for credibility (E-E-A-T).
- Drives two conversion paths: booking a free 30-minute Calendly call (primary) and direct
  email (secondary).

## Repository Purpose

Use this repository to maintain the source code, assets, tests, infrastructure, and
contributor documentation for the Bit and Byte Ideas website. Contributors should keep the
website fast, accessible, clear for prospective clients, and aligned with the established
"Engineered Dark" design direction.

## Documentation Map

- [Architecture](architecture.md): application structure, routing, prerendering, content
  ownership, and design tokens.
- [Development](development.md): setup, common commands, and implementation conventions.
- [UX and Content](ux-content.md): page sections, user journey, calls to action, and
  accessibility expectations.
- [Quality and Operations](quality-operations.md): testing, CI, deployment, SEO
  operations, and rollback.
- Redesign decision record (`docs/redesign/00`–`05`): why the site was rebuilt from
  Angular to React in 2026, every accepted decision, and the phased migration log.

## Current Scope

The application does not include authentication, a backend API, or persisted user data.
The Calendly integration is an external link, not an embed. If those capabilities are
added, update this documentation in the same pull request as the code change.
