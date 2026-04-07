import { Component, ChangeDetectionStrategy } from '@angular/core';

interface Service {
  number: string;
  title: string;
  description: string;
  features: string[];
  badge?: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Services {
  protected readonly services: Service[] = [
    {
      number: '01',
      title: 'Static Website Development',
      description:
        'A polished, fast-loading presence for your business. Built for performance, SEO, and lasting impressions.',
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
        'Interactive, data-driven applications designed around your workflow. Built to scale as your business grows.',
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
        'Optional ongoing subscriptions so you can stay focused on your business while we handle everything technical.',
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
}
