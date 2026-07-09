export interface Service {
  number: string;
  title: string;
  description: string;
  features: string[];
  badge?: string;
}

export const services: Service[] = [
  {
    number: '01',
    title: 'Website & Application Development',
    description:
      'From a fast, polished marketing site to a full-featured application with logins, dashboards, and business logic — we design and build custom software around your goals, not a template. Start where you are today; we architect it to grow with you.',
    features: [
      'Custom design — no templates or page builders',
      'Mobile-first, SEO-optimized, and fast (Core Web Vitals)',
      'User accounts, dashboards & business logic when you need them',
      'Database design, APIs & cloud infrastructure for anything custom',
      'Built to scale from a single page to a full application',
    ],
  },
  {
    number: '02',
    title: 'Business Automation & Integrations',
    description:
      "Stop copying the same information between tools by hand. We connect the software you already use — CRM, invoicing, forms, email, e-commerce — so information flows automatically, and build custom integrations via API when an off-the-shelf connector doesn't exist. Less manual work, fewer mistakes, more time to run your business.",
    features: [
      'Connect the tools you already use (CRM, invoicing, forms, e-commerce, email)',
      "Custom API integrations when an off-the-shelf connector doesn't exist",
      'Automated workflows that replace manual, repetitive tasks',
      'Data sync between systems — no more double data entry',
      'Notifications & alerts wired into the tools your team already checks',
    ],
  },
  {
    number: '03',
    title: 'Maintenance + Hosting',
    description:
      'Stay focused on running your business while we handle everything technical. Monthly plans cover managed cloud hosting, security updates, dependency patches, and performance monitoring — plus keeping automations working as the tools on either end change. Peace of mind, billed monthly.',
    features: [
      'Managed cloud hosting',
      'Automated backups & recovery',
      'Security patches & dependency updates',
      'Performance monitoring & alerts',
      'Priority support & minor changes',
    ],
    badge: 'Add-on subscription',
  },
];
