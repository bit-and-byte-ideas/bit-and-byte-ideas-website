import { services } from './services.ts';

/** What kind of thing a project is (frontmatter `category`). */
export const workCategories = {
  website: 'Website',
  'web-application': 'Web application',
  automation: 'Automation',
  integration: 'Integration',
} as const;

export type WorkCategory = keyof typeof workCategories;

export const workCategoryKeys = Object.keys(workCategories) as [WorkCategory, ...WorkCategory[]];

/**
 * Service lines a project delivered (frontmatter `services`), mapped to the
 * card numbers in services.ts so labels always match the homepage.
 */
const serviceNumbers = {
  build: '01',
  automate: '02',
  maintain: '03',
} as const;

export type WorkService = keyof typeof serviceNumbers;

export const workServiceKeys = Object.keys(serviceNumbers) as [WorkService, ...WorkService[]];

export function workServiceLabel(key: WorkService): string {
  const service = services.find((candidate) => candidate.number === serviceNumbers[key]);
  if (!service) throw new Error(`No service with number ${serviceNumbers[key]} for "${key}"`);
  return service.title;
}

/** Display labels for project `kind` (shown as text, never color alone). */
export const workKindLabels = {
  client: 'Client project',
  internal: 'Internal project',
  concept: 'Concept',
} as const;

export type WorkKind = keyof typeof workKindLabels;
