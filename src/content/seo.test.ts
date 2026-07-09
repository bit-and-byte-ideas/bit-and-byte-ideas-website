import {
  faqPageSchema,
  organizationSchema,
  pageMeta,
  professionalServiceSchema,
  toJsonLdScript,
} from './seo';
import { faqItems } from './faq';
import { services } from './services';

interface SchemaNode {
  '@type': string;
  [key: string]: unknown;
}

describe('pageMeta', () => {
  const meta = pageMeta({ title: 'T', description: 'D', path: '/about' });

  it('emits canonical URL for the route', () => {
    expect(meta).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://www.bitandbyteideas.com/about',
    });
  });

  it('emits og:image dimensions (SEO M4)', () => {
    expect(meta).toContainEqual({ property: 'og:image:width', content: '1004' });
    expect(meta).toContainEqual({ property: 'og:image:height', content: '416' });
    expect(meta).toContainEqual({ property: 'og:locale', content: 'en_US' });
  });
});

describe('organizationSchema', () => {
  const graph = (organizationSchema() as { '@graph': SchemaNode[] })['@graph'];

  it('contains Organization and WebSite nodes', () => {
    expect(graph.map((n) => n['@type'])).toEqual(['Organization', 'WebSite']);
  });

  it('links the GitHub profile via sameAs (SEO M6)', () => {
    const org = graph[0];
    expect(org['sameAs']).toContain('https://github.com/bit-and-byte-ideas');
  });

  it('carries the San Diego postal address (SEO H5)', () => {
    const address = graph[0]['address'] as Record<string, string>;
    expect(address['addressLocality']).toBe('San Diego');
    expect(address['addressRegion']).toBe('CA');
    expect(address['addressCountry']).toBe('US');
  });
});

describe('professionalServiceSchema', () => {
  const schema = professionalServiceSchema() as SchemaNode;

  it('offers every service line through a valid offer catalog (SEO H3)', () => {
    const catalog = schema['hasOfferCatalog'] as { itemListElement: unknown[] };
    expect(catalog.itemListElement).toHaveLength(services.length);
  });

  it('does not use the invalid serviceType array', () => {
    expect(schema['serviceType']).toBeUndefined();
  });
});

describe('faqPageSchema', () => {
  it('maps every FAQ item into a Question (SEO M2)', () => {
    const schema = faqPageSchema() as { mainEntity: unknown[] };
    expect(schema.mainEntity).toHaveLength(faqItems.length);
  });
});

describe('toJsonLdScript', () => {
  it('escapes </script> so a schema value cannot break out of the script element', () => {
    const malicious = { name: '</script><script>alert(1)</script>' };
    const serialized = toJsonLdScript(malicious);
    expect(serialized).not.toContain('</script>');
    expect(serialized).not.toContain('<');
    expect(serialized).toContain('\\u003c/script');
  });

  it('round-trips to the original object once safely embedded', () => {
    const schema = { a: 1, b: '<tag>' };
    const parsed = JSON.parse(toJsonLdScript(schema).replace(/\\u003c/g, '<'));
    expect(parsed).toEqual(schema);
  });
});
