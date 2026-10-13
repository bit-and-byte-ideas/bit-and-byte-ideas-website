import type { MetaDescriptor } from 'react-router';
import { NotFoundContent } from '../components/not-found-content';
import { pageMeta } from '../content/seo';

export function meta(): MetaDescriptor[] {
  return pageMeta({
    title: 'Page Not Found — Bit & Byte Ideas',
    description: "The page you're looking for doesn't exist.",
    path: '/404',
    noIndex: true,
  });
}

export default function NotFound() {
  return <NotFoundContent />;
}
