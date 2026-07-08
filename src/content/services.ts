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
    title: 'Static Website Development',
    description:
      "A polished, fast-loading presence built for lasting impressions and day-one SEO. Whether you're launching a new brand or replacing a template site, you get a custom design crafted around your goals. Delivered on Azure Static Web Apps for global performance and rock-solid uptime.",
    features: [
      'Custom design — no templates',
      'Mobile-first responsive layout',
      'SEO-optimized markup & metadata',
      'Fast performance & Core Web Vitals',
      'Contact forms & third-party integrations',
    ],
  },
  {
    number: '02',
    title: 'Web Application Development',
    description:
      'Interactive, data-driven applications designed around your workflow and built to scale. From customer portals to internal tools, we handle the full stack — frontend, backend, cloud infrastructure, and integrations. You describe the business problem; we engineer the solution.',
    features: [
      'Custom business logic & workflows',
      'User authentication & roles',
      'Database design & API development',
      'Third-party service integrations',
      'Scalable cloud architecture',
    ],
  },
  {
    number: '03',
    title: 'Maintenance + Hosting',
    description:
      'Stay focused on running your business while we handle everything technical. Monthly plans cover managed cloud hosting, security updates, dependency patches, and performance monitoring — plus priority support when you need a quick change. Peace of mind, billed monthly.',
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
