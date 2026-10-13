export interface Author {
  name: string;
  role: string;
  /** Site-relative profile page. */
  url: string;
  /** One sentence for the author box, using only facts published on /about. */
  bio: string;
}

/** Article authors, keyed by the `author` frontmatter value. */
export const authors = {
  'carlos-barajas': {
    name: 'Carlos Barajas',
    role: 'Founder & Engineer',
    url: '/about',
    bio: 'Carlos founded Bit & Byte Ideas after building software since 2008 across fintech, energy, and financial services.',
  },
} as const satisfies Record<string, Author>;

export type AuthorKey = keyof typeof authors;

export const authorKeys = Object.keys(authors) as [AuthorKey, ...AuthorKey[]];
