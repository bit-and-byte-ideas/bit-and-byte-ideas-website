# Graph Report - .  (2026-05-22)

## Corpus Check
- 149 files · ~68,376 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 490 nodes · 560 edges · 53 communities (36 shown, 17 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.84)
- Token cost: 34,500 input · 9,550 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Angular Architect Skills|Angular Architect Skills]]
- [[_COMMUNITY_App Components & Routing|App Components & Routing]]
- [[_COMMUNITY_CICD & Build Pipeline|CI/CD & Build Pipeline]]
- [[_COMMUNITY_Angular Core Concepts|Angular Core Concepts]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Angular Workspace Build|Angular Workspace Build]]
- [[_COMMUNITY_Signals & Rendering|Signals & Rendering]]
- [[_COMMUNITY_Routing & Animations|Routing & Animations]]
- [[_COMMUNITY_Skills Lock Registry|Skills Lock Registry]]
- [[_COMMUNITY_UI Components & Booking|UI Components & Booking]]
- [[_COMMUNITY_Angular Workspace Config|Angular Workspace Config]]
- [[_COMMUNITY_Testing & Tooling|Testing & Tooling]]
- [[_COMMUNITY_Booking Component|Booking Component]]
- [[_COMMUNITY_Angular Reference Docs|Angular Reference Docs]]
- [[_COMMUNITY_Resource & Signal Forms|Resource & Signal Forms]]
- [[_COMMUNITY_Claude Architect Testing|Claude Architect Testing]]
- [[_COMMUNITY_HTTP & Resource Testing|HTTP & Resource Testing]]
- [[_COMMUNITY_Hero Component|Hero Component]]
- [[_COMMUNITY_Brand Logo Assets|Brand Logo Assets]]
- [[_COMMUNITY_Angular ARIA Patterns|Angular ARIA Patterns]]
- [[_COMMUNITY_Router & TestBed|Router & TestBed]]
- [[_COMMUNITY_Brand Icon|Brand Icon]]
- [[_COMMUNITY_NgRx State Management|NgRx State Management]]
- [[_COMMUNITY_Claude Local Settings|Claude Local Settings]]
- [[_COMMUNITY_Component Outputs|Component Outputs]]
- [[_COMMUNITY_Standalone Components|Standalone Components]]
- [[_COMMUNITY_VSCode MCP Config|VSCode MCP Config]]
- [[_COMMUNITY_DI Injection Context|DI Injection Context]]
- [[_COMMUNITY_OnPush & Component Patterns|OnPush & Component Patterns]]
- [[_COMMUNITY_Azure & Infra Deploy|Azure & Infra Deploy]]
- [[_COMMUNITY_DI Provider Patterns|DI Provider Patterns]]
- [[_COMMUNITY_Codex Agent Hooks|Codex Agent Hooks]]
- [[_COMMUNITY_OpenTofu Pre-commit|OpenTofu Pre-commit]]
- [[_COMMUNITY_Named Router Outlets|Named Router Outlets]]
- [[_COMMUNITY_VSCode Launch Config|VSCode Launch Config]]
- [[_COMMUNITY_VSCode Tasks|VSCode Tasks]]
- [[_COMMUNITY_Tofu Format Hook|Tofu Format Hook]]
- [[_COMMUNITY_Tofu Validate Hook|Tofu Validate Hook]]
- [[_COMMUNITY_VSCode Extensions|VSCode Extensions]]
- [[_COMMUNITY_View Encapsulation|View Encapsulation]]
- [[_COMMUNITY_Host Selector Styling|Host Selector Styling]]
- [[_COMMUNITY_Act Wait Assert Pattern|Act Wait Assert Pattern]]
- [[_COMMUNITY_Playwright E2E Testing|Playwright E2E Testing]]
- [[_COMMUNITY_RxJS Higher Order Ops|RxJS Higher Order Ops]]
- [[_COMMUNITY_RxJS ShareReplay|RxJS ShareReplay]]
- [[_COMMUNITY_Frontend Design Skill|Frontend Design Skill]]
- [[_COMMUNITY_Frontend Aesthetics|Frontend Aesthetics]]
- [[_COMMUNITY_CanMatch Guard|CanMatch Guard]]
- [[_COMMUNITY_CanDeactivate Guard|CanDeactivate Guard]]
- [[_COMMUNITY_Footer Template|Footer Template]]

## God Nodes (most connected - your core abstractions)
1. `Angular Architect Skill` - 12 edges
2. `Angular Developer Skill` - 11 edges
3. `Angular Testing Skill` - 9 edges
4. `Angular Developer Skill` - 9 edges
5. `Signal Forms` - 9 edges
6. `Rendering Strategies (CSR, SSG, SSR)` - 8 edges
7. `bit-and-byte-ideas` - 7 edges
8. `CLAUDE.md - Claude Code Instructions` - 7 edges
9. `linkedSignal vs computed vs effect Rationale` - 7 edges
10. `Angular Signals Overview` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Lazy Loading Routes` --semantically_similar_to--> `Architect Routing & Lazy Loading`  [INFERRED] [semantically similar]
  .agents/skills/angular-developer/references/loading-strategies.md → .claude/skills/angular-architect/references/routing.md
- `Functional Route Guards` --semantically_similar_to--> `Architect Routing & Lazy Loading`  [INFERRED] [semantically similar]
  .agents/skills/angular-developer/references/route-guards.md → .claude/skills/angular-architect/references/routing.md
- `CLAUDE.md - Claude Code Instructions` --semantically_similar_to--> `AGENTS.md - Codex Agent Instructions`  [INFERRED] [semantically similar]
  CLAUDE.md → AGENTS.md
- `Angular Dependency Injection Providers` --semantically_similar_to--> `inject() Function for Dependency Injection`  [INFERRED] [semantically similar]
  .agents/skills/angular-developer/references/defining-providers.md → CLAUDE.md
- `Vitest Unit Testing Framework` --semantically_similar_to--> `Jasmine Testing Framework (Legacy)`  [INFERRED] [semantically similar]
  CLAUDE.md → .agents/skills/angular-testing/references/vitest-migration.md

## Hyperedges (group relationships)
- **Angular 17+ Architecture Constraints** — concept_angular_standalone, concept_onpush_change_detection, concept_angular_signals, concept_inject_fn [EXTRACTED 1.00]
- **NgRx Actions-Reducers-Selectors Pattern** — concept_ngrx, concept_ngrx_entity_adapter, concept_ngrx_facade [EXTRACTED 1.00]
- **Agent Skill Ecosystem for Website Development** — skill_angular_developer, skill_angular_architect, skill_angular_testing, skill_frontend_design [EXTRACTED 1.00]
- **Angular Signals Reactivity System (signal, computed, linkedSignal, effect)** — concept_writable_signal, concept_computed_signal, concept_linked_signal, concept_effect, concept_reactive_context [EXTRACTED 1.00]
- **Angular Form Approaches (Signal Forms, Reactive Forms, Template-Driven Forms)** — concept_signal_forms_api, concept_form_control, concept_ng_model [INFERRED 0.95]
- **Angular Routing System (provideRouter, RouterLink, Router.navigate, resolvers)** — concept_provide_router, concept_router_link, concept_router_navigate, concept_resolve_fn, concept_router_events [EXTRACTED 1.00]
- **NgRx State Management Flow (Actions, Reducer, Effects, Selectors)** — claude_architect_ngrx_actions, claude_architect_ngrx_entity_adapter, claude_architect_ngrx_effects, claude_architect_ngrx_store [EXTRACTED 1.00]
- **Angular DI Hierarchy Pattern (InjectionToken, Scopes, Injectors)** — claude_defining_providers_injection_token, claude_defining_providers_provider_scopes, agents_hierarchical_injectors_environment_injector, agents_hierarchical_injectors_element_injector [INFERRED 0.95]
- **Angular Routing Access Control (Guards, Lazy Loading, Resolvers)** — agents_route_guards_canactivate, agents_loading_strategies_lazy_loading, claude_architect_routing_resolvers [INFERRED 0.85]
- **Angular Signals Reactivity Triad: signal, computed, linkedSignal** — references_signals_overview_signal, references_signals_overview_computed, references_linked_signal_concept [EXTRACTED 1.00]
- **Angular Forms Approaches: Reactive, Template-Driven, Signal-based** — references_reactive_forms, references_template_driven_forms, references_inputs_model_input [INFERRED 0.85]
- **Angular Routing Lifecycle: Routes, Navigation, Resolvers, Events** — references_define_routes_routes_array, references_navigate_to_routes_router_navigate, references_data_resolvers_resolvefn, references_router_lifecycle_events [EXTRACTED 1.00]
- **CI/CD Pipeline (Format + Test + Build + Deploy)** — ci_workflow_formatjob, ci_workflow_testjob, ci_workflow_buildjob, deploy_app_dev_workflow [EXTRACTED 1.00]
- **Angular Routing System (Outlets + Guards + Loading Strategies)** — show_routes_routeroutlet, route_guards_canactivatefn, loading_strategies_lazyloading, router_testing_routertestingharness [INFERRED 0.85]
- **Signal Forms Validation Flow (form + validateAsync + resource)** — signal_forms_formfunction, signal_forms_validateasync, resource_resource, signal_forms_validationerror [EXTRACTED 1.00]
- **Single-Page Anchor Navigation Flow Across Components** — nav_nav_html, hero_hero_html, services_services_html, booking_booking_html [EXTRACTED 1.00]
- **Booking and Consultation Conversion Flow** — booking_booking_html, concept_calendly_widget, concept_free_consultation [EXTRACTED 1.00]
- **Hero Section Engagement Pattern (content, CTA, visual)** — hero_hero_html, concept_hero_ctas, concept_dot_grid, concept_scroll_indicator [EXTRACTED 1.00]

## Communities (53 total, 17 thin omitted)

### Community 0 - "Angular Architect Skills"
Cohesion: 0.07
Nodes (45): Angular Standalone Components Reference, NgRx State Management Reference, Angular Routing Reference, RxJS Patterns Reference, Angular Architect Testing Reference, Angular Aria Accessibility Reference, Angular CLI Guide, Angular Signal-based Inputs Reference (+37 more)

### Community 1 - "App Components & Routing"
Cohesion: 0.06
Nodes (27): App, appConfig, routes, compiled, Contact, link, mockBusinessInfo, Footer (+19 more)

### Community 2 - "CI/CD & Build Pipeline"
Cohesion: 0.06
Nodes (35): CI GitHub Actions Workflow, CI Production Build Job, CI Format Check Job (Prettier), CI Unit Tests Job, :host Selector, ::ng-deep Selector, View Encapsulation, Architecture Documentation (+27 more)

### Community 3 - "Angular Core Concepts"
Cohesion: 0.08
Nodes (31): FormControl, FormGroup, FormArray, Host Property Bindings in @Component, inject() Function for Dependency Injection, NgModel Two-Way Binding (Template-Driven Forms), providedIn: 'root' Singleton Pattern, ResolveFn Data Resolver, Router Events Observable, Signal Forms API (form(), FormField, submit()) (+23 more)

### Community 4 - "Package Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/router, rxjs (+21 more)

### Community 5 - "Angular Workspace Build"
Cohesion: 0.08
Nodes (26): build, serve, test, architect, builder, configurations, defaultConfiguration, options (+18 more)

### Community 6 - "Signals & Rendering"
Cohesion: 0.13
Nodes (25): afterRenderEffect for DOM Manipulation, computed Signal, Client-Side Rendering (CSR), effect() for Side Effects, Hydration (SSR to Client), linkedSignal API, Reactive Context in Angular Signals, Static Site Generation (SSG / Prerendering) (+17 more)

### Community 7 - "Routing & Animations"
Cohesion: 0.13
Nodes (20): Nested (Child) Routes, Legacy @angular/animations DSL, Native CSS Animations (animate.enter / animate.leave), provideRouter Route Configuration, RouterLink Directive (Declarative Navigation), Router.navigate() Programmatic Navigation, RouterTestingHarness, View Transitions API for Route Animations (+12 more)

### Community 8 - "Skills Lock Registry"
Cohesion: 0.11
Nodes (18): computedHash, source, sourceType, computedHash, source, sourceType, computedHash, source (+10 more)

### Community 9 - "UI Components & Booking"
Cohesion: 0.15
Nodes (17): Booking Component Template, Anchor-based Page Navigation (#services, #contact, #booking), Angular @for Control Flow, ARIA Accessibility Attributes, Calendly Inline Widget, Dot Grid Background Decoration, Free Consultation CTA, Get a Quote CTA (+9 more)

### Community 10 - "Angular Workspace Config"
Cohesion: 0.12
Nodes (15): prefix, projectType, root, schematics, sourceRoot, cli, analytics, packageManager (+7 more)

### Community 11 - "Testing & Tooling"
Cohesion: 0.15
Nodes (15): Cypress E2E Testing Framework, HarnessLoader and TestbedHarnessEnvironment, Tailwind CSS v4 PostCSS Integration, Angular CLI Guide, ng add Command, ng build Command, ng generate Command, ng serve Command (+7 more)

### Community 12 - "Booking Component"
Cohesion: 0.16
Nodes (10): Booking, addEventListenerSpy, container, f, heading, initInlineWidget, script, section (+2 more)

### Community 13 - "Angular Reference Docs"
Cohesion: 0.18
Nodes (13): inject() Function Context Rules, Eager Loading Routes, Lazy Loading Routes, CanActivate Route Guard, Functional Route Guards, Named Router Outlets, RouterOutlet Directive, ng new Project Creation Rules (+5 more)

### Community 14 - "Resource & Signal Forms"
Cohesion: 0.15
Nodes (11): httpResource, resource() API, Resource Status Signals, FieldState, FormField Directive, form() Function, Model-Driven Form Pattern (Signal Forms), Signal Forms (+3 more)

### Community 15 - "Claude Architect Testing"
Cohesion: 0.22
Nodes (9): TestBed Configuration, Angular Architect Skill, Architect Routing & Lazy Loading, Custom Preloading Strategy, Route Resolvers (ResolveFn), RxJS Essential Operators, takeUntilDestroyed Subscription Cleanup, RxJS Marble Testing (+1 more)

### Community 16 - "HTTP & Resource Testing"
Cohesion: 0.22
Nodes (9): httpResource, Angular resource() API, Signal-Based Async Reactivity, HTTP Resource Testing, Signal-Based Component Testing, Angular Testing Skill, Vitest Setup for Angular v20+, Jasmine to Vitest Migration Guide (+1 more)

### Community 17 - "Hero Component"
Cohesion: 0.29
Nodes (6): Hero, em, h1, link, links, section

### Community 18 - "Brand Logo Assets"
Cohesion: 0.53
Nodes (6): Bit & Byte Ideas Brand Identity, Blue-to-Green Gradient Color Scheme, Digital / Technology Theme, Bit & Byte Ideas Full Logo, Pixelated Lightbulb Icon, Bit & Byte Ideas Wordmark Typography

### Community 19 - "Angular ARIA Patterns"
Cohesion: 0.33
Nodes (6): Accordion ARIA Pattern, Combobox ARIA Pattern, Angular Aria Headless Directives, Listbox ARIA Pattern, Tabs ARIA Pattern, Tree ARIA Pattern

### Community 20 - "Router & TestBed"
Cohesion: 0.40
Nodes (6): provideRouter() for Tests, RouterTestingHarness, ComponentFixture, TestBed, fixture.whenStable(), Zoneless Testing Pattern

### Community 21 - "Brand Icon"
Cohesion: 0.70
Nodes (5): Bit and Byte Ideas Brand Identity, Digital Pixel Elements, Lightbulb Motif, Bit and Byte Ideas Brand Icon (Small), Technology and Creativity Fusion

### Community 22 - "NgRx State Management"
Cohesion: 0.40
Nodes (5): NgRx createActionGroup, NgRx Effects, NgRx Entity Adapter, NgRx Facade Pattern, NgRx Store Setup

### Community 23 - "Claude Local Settings"
Cohesion: 0.40
Nodes (4): hooks, PostToolUse, permissions, allow

### Community 24 - "Component Outputs"
Cohesion: 0.60
Nodes (5): @Output() Decorator (Legacy), output() Function-based Component Outputs, Component Outputs (Custom Events), Decorator-based Output (@Output), Function-based Output (output())

### Community 25 - "Standalone Components"
Cohesion: 0.40
Nodes (5): Standalone Angular Components, Angular Template Control Flow (@if, @for, @switch), Angular Components, Standalone Components, Template Control Flow (@if @for @switch)

### Community 26 - "VSCode MCP Config"
Cohesion: 0.40
Nodes (4): args, command, servers, angular-cli

### Community 27 - "DI Injection Context"
Cohesion: 0.50
Nodes (4): ElementInjector, EnvironmentInjector, providers vs viewProviders, runInInjectionContext

### Community 28 - "OnPush & Component Patterns"
Cohesion: 0.50
Nodes (4): OnPush Component Testing, OnPush Change Detection Strategy, Smart vs Dumb Component Pattern, Standalone Components with Signals

### Community 29 - "Azure & Infra Deploy"
Cohesion: 0.50
Nodes (4): Azure Static Web Apps Deploy Action, Deploy App Dev GitHub Actions Workflow, OpenTofu Infrastructure Provisioning, Deploy Infrastructure Dev GitHub Actions Workflow

### Community 30 - "DI Provider Patterns"
Cohesion: 0.67
Nodes (3): InjectionToken for Non-Class Deps, Library provide*() Function Pattern, Provider Scopes

### Community 32 - "OpenTofu Pre-commit"
Cohesion: 0.67
Nodes (3): OpenTofu fmt Pre-commit Hook, OpenTofu validate Pre-commit Hook, Pre-commit Configuration

### Community 33 - "Named Router Outlets"
Cohesion: 0.67
Nodes (3): Named Outlets (Secondary Routes), RouterOutlet Directive, routerOutletData Input

## Knowledge Gaps
- **199 isolated node(s):** `version`, `source`, `sourceType`, `computedHash`, `source` (+194 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ResolveFn Data Resolver` connect `Angular Core Concepts` to `Routing & Animations`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Routes Array Configuration` connect `Routing & Animations` to `Angular Core Concepts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Signal-based Input (input())` connect `Angular Core Concepts` to `Component Outputs`, `Signals & Rendering`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `version`, `source`, `sourceType` to the rest of the system?**
  _209 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Angular Architect Skills` be split into smaller, more focused modules?**
  _Cohesion score 0.06868686868686869 - nodes in this community are weakly interconnected._
- **Should `App Components & Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.06236786469344609 - nodes in this community are weakly interconnected._
- **Should `CI/CD & Build Pipeline` be split into smaller, more focused modules?**
  _Cohesion score 0.06258890469416785 - nodes in this community are weakly interconnected._