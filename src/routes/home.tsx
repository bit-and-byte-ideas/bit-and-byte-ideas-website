import type { MetaDescriptor } from 'react-router';
import { Hero } from '../components/hero';
import { TrustStrip } from '../components/trust-strip';
import { Services } from '../components/services';
import { Process } from '../components/process';
import { Contact } from '../components/contact';
import { defaultDescription, pageMeta, professionalServiceSchema } from '../content/seo';

export function meta(): MetaDescriptor[] {
  return pageMeta({
    title: 'Bit & Byte Ideas — Software Consulting',
    description: defaultDescription,
    path: '/',
  });
}

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Services />
      <Process />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema()) }}
      />
    </>
  );
}
