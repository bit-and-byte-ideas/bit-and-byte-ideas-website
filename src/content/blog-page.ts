/** UI copy for /blog and /blog/<slug>. Articles live in src/content/blog/. */
export const blogPage = {
  label: 'blog',
  title: 'Engineering',
  titleAccent: 'Notes',
  dek: 'Practical decisions behind websites, automation, and the systems that keep them running.',
  meta: {
    title: 'Blog — Bit & Byte Ideas',
    description:
      'Practical articles on building websites, web applications, and business automation, from Bit & Byte Ideas, a San Diego software studio.',
  },
  empty: {
    heading: 'Articles are on the way',
    body: "We're writing about practical engineering decisions for small businesses. Until the first one is out, the fastest way to get an answer is to ask us directly.",
  },
  backLink: 'All articles',
  listLabel: 'Articles',
  byline: 'By',
  published: 'Published',
  updated: 'Updated',
  readingTime: 'Reading time',
  minutesRead: (minutes: number) => `${minutes} min read`,
  tagsLabel: 'Topics',
  tocLabel: 'On this page',
  related: 'Related articles',
  authorLabel: 'About the author',
  authorLink: (name: string) => `More about ${name}`,
  cta: {
    label: 'Want help with this?',
    heading: "Let's Talk.",
  },
  status: {
    draft: 'Draft: visible only in local development. Not published.',
    fixture: 'Development fixture: invented content for testing. Never deployed.',
  },
};
