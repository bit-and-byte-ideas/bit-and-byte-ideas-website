/**
 * Controlled tag vocabulary for articles. Add a tag here before using it in
 * frontmatter; validation rejects anything else (docs/website/CONTENT.md).
 */
export const blogTags = {
  react: 'React',
  typescript: 'TypeScript',
  go: 'Go',
  'api-design': 'API design',
  automation: 'Automation',
  integrations: 'Integrations',
  cloud: 'Cloud',
  'infrastructure-as-code': 'Infrastructure as code',
  performance: 'Performance',
  accessibility: 'Accessibility',
  security: 'Security',
  'web-development': 'Web development',
  maintenance: 'Maintenance',
  'small-business': 'Small business',
  'engineering-decisions': 'Engineering decisions',
} as const;

export type BlogTag = keyof typeof blogTags;

export const blogTagKeys = Object.keys(blogTags) as [BlogTag, ...BlogTag[]];
