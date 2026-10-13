// Frontmatter schemas for the work and blog collections: the executable form
// of docs/website/CONTENT.md#schemas. Keep the two in sync.
//
// Modules under src/content/collections/ import siblings with explicit `.ts`
// extensions so Node can run scripts/*.ts directly (type stripping); Vite
// resolves them the same way. Client code may only `import type` from here.
import { z } from 'zod';
import { authorKeys } from '../authors.ts';
import { blogTagKeys } from '../blog-tags.ts';
import { workCategoryKeys, workServiceKeys } from '../work-taxonomy.ts';

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_MAX_LENGTH = 60;
export const FIXTURE_TITLE_PREFIX = '[Fixture]';

function isRealDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a date written as YYYY-MM-DD')
  .refine(isRealDate, 'is not a real calendar date');

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'must be written as YYYY-MM');

const text = (max: number) => z.string().trim().min(1, 'must not be empty').max(max);

const imageFile = z
  .string()
  .regex(
    /^[A-Za-z0-9][A-Za-z0-9._-]*\.(png|jpe?g)$/i,
    "must be a .png or .jpg file name in this entry's images/ folder",
  );

export const ALT_MIN_LENGTH = 10;

const altText = z
  .string()
  .trim()
  .min(ALT_MIN_LENGTH, 'must describe what the image shows (at least 10 characters)')
  .max(200);

const signOff = z
  .object({
    approvedBy: text(120),
    approvedOn: isoDate,
  })
  .strict();

const seo = z
  .object({
    title: text(60).optional(),
    description: text(160).optional(),
  })
  .strict();

export const approvalScopes = ['name', 'description', 'screenshots', 'live-link', 'outcomes'] as const;

const projectImage = z
  .object({
    file: imageFile,
    alt: altText,
    role: z.enum(['cover', 'gallery']),
    viewport: z.enum(['desktop', 'mobile']),
    capturedOn: isoDate,
    caption: text(200).optional(),
  })
  .strict();

type Issue = { path: (string | number)[]; message: string };
const issue = (ctx: z.RefinementCtx, { path, message }: Issue) =>
  ctx.addIssue({ code: 'custom', path, message });

export const projectSchema = z
  .object({
    title: text(70),
    summary: z.string().trim().min(50, 'must be at least 50 characters').max(160),
    kind: z.enum(['client', 'internal', 'concept']),
    status: z.enum(['draft', 'published']),
    category: z.enum(workCategoryKeys, {
      error: (iss) => `"${String(iss.input)}" is not in src/content/work-taxonomy.ts`,
    }),
    services: z
      .array(
        z.enum(workServiceKeys, {
          error: (iss) => `"${String(iss.input)}" must be one of: ${workServiceKeys.join(', ')}`,
        }),
      )
      .min(1, 'must list at least one service'),
    industry: text(40),
    technologies: z.array(text(60)).min(1, 'must list at least one technology').max(10),
    completedOn: yearMonth.optional(),
    updatedOn: isoDate.optional(),
    liveUrl: z.url({ protocol: /^https$/, error: 'must be an https:// URL' }).optional(),
    featured: z.number().int().min(1).optional(),
    client: z
      .object({
        name: text(120),
        anonymized: z.boolean(),
      })
      .strict()
      .optional(),
    publicApproval: z
      .object({
        approvedBy: text(120),
        approvedOn: isoDate,
        scope: z.array(z.enum(approvalScopes)).min(1),
        reference: text(300),
      })
      .strict()
      .optional(),
    images: z.array(projectImage).default([]),
    outcomes: z
      .array(
        z
          .object({
            statement: text(300),
            evidence: text(500),
          })
          .strict(),
      )
      .optional(),
    review: signOff.optional(),
    seo: seo.optional(),
    fixture: z.literal(true).optional(),
  })
  .strict()
  .superRefine((project, ctx) => {
    const published = project.status === 'published';
    const fixture = project.fixture === true;
    const isClient = project.kind === 'client';

    if (isClient && !project.client) {
      issue(ctx, { path: ['client'], message: 'is required for kind: client' });
    }
    if (!isClient && project.client) {
      issue(ctx, { path: ['client'], message: 'is only allowed for kind: client' });
    }
    if (!isClient && project.publicApproval) {
      issue(ctx, { path: ['publicApproval'], message: 'is only allowed for kind: client' });
    }
    if (project.kind === 'concept' && project.outcomes?.length) {
      issue(ctx, {
        path: ['outcomes'],
        message: 'are not allowed for concepts: a concept has no real results to report',
      });
    }

    const covers = project.images.filter((image) => image.role === 'cover').length;
    if (project.images.length > 0 && covers !== 1) {
      issue(ctx, {
        path: ['images'],
        message: `need exactly one image with role: cover (found ${covers})`,
      });
    }

    if (published) {
      if (!project.completedOn) {
        issue(ctx, { path: ['completedOn'], message: 'is required when status is published' });
      }
      if (project.images.length === 0) {
        issue(ctx, { path: ['images'], message: 'need at least one image when status is published' });
      }
      if (!fixture && !project.review) {
        issue(ctx, {
          path: ['review'],
          message: "is required when status is published (Carlos's sign-off)",
        });
      }
      if (!fixture && isClient && !project.publicApproval) {
        issue(ctx, {
          path: ['publicApproval'],
          message: "is required to publish client work (the client's written approval)",
        });
      }
    }

    const scope = project.publicApproval?.scope;
    if (scope) {
      if (project.liveUrl && !scope.includes('live-link')) {
        issue(ctx, { path: ['liveUrl'], message: 'needs "live-link" in publicApproval.scope' });
      }
      if (project.outcomes?.length && !scope.includes('outcomes')) {
        issue(ctx, { path: ['outcomes'], message: 'need "outcomes" in publicApproval.scope' });
      }
      if (project.images.length > 0 && !scope.includes('screenshots')) {
        issue(ctx, { path: ['images'], message: 'need "screenshots" in publicApproval.scope' });
      }
      if (project.client && !project.client.anonymized && !scope.includes('name')) {
        issue(ctx, {
          path: ['client', 'name'],
          message: 'needs "name" in publicApproval.scope, or set client.anonymized: true',
        });
      }
    }
  });

export const articleSchema = z
  .object({
    title: text(80),
    description: z.string().trim().min(50, 'must be at least 50 characters').max(160),
    status: z.enum(['draft', 'published']),
    author: z.enum(authorKeys, {
      error: (iss) => `"${String(iss.input)}" is not in src/content/authors.ts`,
    }),
    publishedOn: isoDate.optional(),
    updatedOn: isoDate.optional(),
    tags: z
      .array(
        z.enum(blogTagKeys, {
          error: (iss) => `"${String(iss.input)}" is not in src/content/blog-tags.ts`,
        }),
      )
      .min(1, 'must list at least one tag')
      .max(4, 'must list at most four tags'),
    toc: z.enum(['auto', 'show', 'hide']).default('auto'),
    cover: z
      .object({
        file: imageFile,
        alt: altText,
      })
      .strict()
      .optional(),
    review: signOff.optional(),
    seo: seo.optional(),
    fixture: z.literal(true).optional(),
  })
  .strict()
  .superRefine((article, ctx) => {
    const published = article.status === 'published';
    if (published && !article.publishedOn) {
      issue(ctx, { path: ['publishedOn'], message: 'is required when status is published' });
    }
    if (published && article.fixture !== true && !article.review) {
      issue(ctx, {
        path: ['review'],
        message: "is required when status is published (Carlos's sign-off)",
      });
    }
    if (article.updatedOn && article.publishedOn && article.updatedOn < article.publishedOn) {
      issue(ctx, { path: ['updatedOn'], message: 'is before publishedOn' });
    }
    if (new Set(article.tags).size !== article.tags.length) {
      issue(ctx, { path: ['tags'], message: 'contain duplicates' });
    }
  });

export type ProjectFrontmatter = z.output<typeof projectSchema>;
export type ArticleFrontmatter = z.output<typeof articleSchema>;
