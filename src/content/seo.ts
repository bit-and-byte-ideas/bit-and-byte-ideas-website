import type { MetaDescriptor } from 'react-router';
import { site } from './site';
import { businessInfo } from './business-info';

export const defaultDescription =
  'Bit & Byte Ideas is a software consulting firm specializing in static website development, web application development, and maintenance & hosting subscriptions.';

const ogImage = `${site.url}/assets/bit_byte_ideas_full_logo.png`;

interface PageMetaOptions {
  title: string;
  description: string;
  /** Route path starting with '/', used for canonical + og:url. */
  path: string;
  noIndex?: boolean;
}

export function pageMeta({ title, description, path, noIndex }: PageMetaOptions): MetaDescriptor[] {
  const url = path === '/' ? `${site.url}/` : `${site.url}${path}`;
  return [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: site.name },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: ogImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
    ...(noIndex ? [{ name: 'robots', content: 'noindex' }] : []),
  ];
}

export function professionalServiceSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    description: defaultDescription,
    url: site.url,
    email: businessInfo.email,
    priceRange: '$$',
    areaServed: 'Worldwide',
    sameAs: [site.githubUrl],
    serviceType: [
      'Static Website Development',
      'Web Application Development',
      'Website Maintenance & Hosting',
    ],
  };
}
