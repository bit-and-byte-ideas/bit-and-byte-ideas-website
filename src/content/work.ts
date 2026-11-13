export interface WorkItem {
  client: string;
  location: string;
  summary: string;
  url: string;
  /** Host shown as the link label, e.g. "jcbodyandpaint.com". */
  urlLabel: string;
}

/** Client work we are cleared to name publicly. Only state facts visible on the live site. */
export const workItems: WorkItem[] = [
  {
    client: 'J C Body & Paint',
    location: 'Auto body shop — Victorville, CA',
    summary:
      'A single-page site with an online estimate request form, a photo gallery, and click-to-call and directions links.',
    url: 'https://www.jcbodyandpaint.com',
    urlLabel: 'jcbodyandpaint.com',
  },
];
