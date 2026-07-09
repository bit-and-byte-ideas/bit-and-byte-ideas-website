import type { MetaDescriptor } from 'react-router';
import { site } from './site';
import { businessInfo } from './business-info';
import { services } from './services';
import { faqItems } from './faq';

export const defaultDescription =
  'Bit & Byte Ideas is a San Diego software studio building custom websites and web applications for small businesses across the United States. No templates — free 30-minute consultation.';

// og:image stays PNG for scraper compatibility; dimensions per SEO M4.
const ogImage = {
  url: `${site.url}/assets/bit_byte_ideas_full_logo.png`,
  width: '1004',
  height: '416',
  alt: 'Bit & Byte Ideas — software studio logo',
};

const organizationId = `${site.url}/#organization`;

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
    { property: 'og:image', content: ogImage.url },
    { property: 'og:image:width', content: ogImage.width },
    { property: 'og:image:height', content: ogImage.height },
    { property: 'og:image:alt', content: ogImage.alt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage.url },
    ...(noIndex ? [{ name: 'robots', content: 'noindex' }] : []),
  ];
}

const postalAddress = {
  '@type': 'PostalAddress',
  addressLocality: site.location.city,
  addressRegion: site.location.region,
  addressCountry: site.location.country,
};

/** Organization + WebSite graph (SEO H3). */
export function organizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: site.name,
        url: site.url,
        logo: { '@type': 'ImageObject', url: ogImage.url },
        image: ogImage.url,
        description:
          'A software studio specializing in static website development, web application development, and maintenance & hosting for small and medium businesses.',
        email: businessInfo.email,
        foundingDate: String(site.foundedYear),
        founder: { '@type': 'Person', name: 'Carlos Barajas' },
        address: postalAddress,
        areaServed: site.location.areaServed,
        sameAs: [site.githubUrl],
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: 'Software Studio — Static Websites, Web Apps, and Maintenance.',
        publisher: { '@id': organizationId },
        inLanguage: 'en-US',
      },
    ],
  };
}

/** ProfessionalService with a valid offer catalog (SEO H3/M6/H5). */
export function professionalServiceSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#service`,
    name: site.name,
    url: site.url,
    email: businessInfo.email,
    image: ogImage.url,
    logo: ogImage.url,
    description: defaultDescription,
    address: postalAddress,
    areaServed: site.location.areaServed,
    parentOrganization: { '@id': organizationId },
    sameAs: [site.githubUrl],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Software Development Services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
        },
      })),
    },
  };
}

/** FAQPage schema built from the FAQ content module (SEO M2). */
export function faqPageSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/**
 * Serializes a JSON-LD object for inline <script> injection via
 * dangerouslySetInnerHTML. Escapes '<' so a value containing "</script>" or
 * "<!--" cannot break out of the script element and inject markup — defense
 * in depth even though current schema content is fully static, not
 * user-supplied.
 */
export function toJsonLdScript(schema: object): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
