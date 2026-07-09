import type { MetaDescriptor } from 'react-router';
import { Hero } from '../components/hero';
import { TrustStrip } from '../components/trust-strip';
import { Services } from '../components/services';
import { Process } from '../components/process';
import { Faq } from '../components/faq';
import { Contact } from '../components/contact';
import {
  defaultDescription,
  faqPageSchema,
  organizationSchema,
  pageMeta,
  professionalServiceSchema,
  toJsonLdScript,
} from '../content/seo';

export function meta(): MetaDescriptor[] {
  return pageMeta({
    title: 'Custom Websites & Web Apps for Small Businesses | Bit & Byte Ideas',
    description: defaultDescription,
    path: '/',
  });
}

function JsonLd({ schema }: { schema: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLdScript(schema) }} />;
}

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Services />
      <Process />
      <Faq />
      <Contact />
      <JsonLd schema={organizationSchema()} />
      <JsonLd schema={professionalServiceSchema()} />
      <JsonLd schema={faqPageSchema()} />
    </>
  );
}
