import { render, screen } from '@testing-library/react';
import type { ResolvedImage } from '../content/collections/media.ts';
import { ResponsiveImage } from './responsive-image';

const image: ResolvedImage = {
  width: 2880,
  height: 1800,
  src: '/media/work/example/home-1200.abcd1234.webp',
  avifSrcSet: '/media/work/example/home-480.abcd1234.avif 480w, /media/work/example/home-1200.abcd1234.avif 1200w',
  webpSrcSet: '/media/work/example/home-480.abcd1234.webp 480w, /media/work/example/home-1200.abcd1234.webp 1200w',
};
const alt = 'Example homepage with the booking button above the fold';
const sizes = '(min-width: 900px) 58vw, 100vw';

describe('ResponsiveImage', () => {
  it('offers AVIF first and WebP second, both with the same sizes', () => {
    const { container } = render(<ResponsiveImage image={image} alt={alt} sizes={sizes} />);
    const sources = [...container.querySelectorAll('picture > source')];
    expect(sources.map((source) => source.getAttribute('type'))).toEqual(['image/avif', 'image/webp']);
    expect(sources.map((source) => source.getAttribute('srcset'))).toEqual([image.avifSrcSet, image.webpSrcSet]);
    expect(sources.every((source) => source.getAttribute('sizes') === sizes)).toBe(true);
  });

  it('renders an img with alt text, intrinsic dimensions, and a WebP fallback', () => {
    render(<ResponsiveImage image={image} alt={alt} sizes={sizes} />);
    const img = screen.getByRole('img', { name: alt });
    expect(img).toHaveAttribute('src', image.src);
    expect(img).toHaveAttribute('width', '2880');
    expect(img).toHaveAttribute('height', '1800');
    expect(img).toHaveAttribute('sizes', sizes);
    expect(img).toHaveAttribute('srcset', image.webpSrcSet);
  });

  it('lazy-loads by default', () => {
    render(<ResponsiveImage image={image} alt={alt} sizes={sizes} />);
    const img = screen.getByRole('img', { name: alt });
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    expect(img).not.toHaveAttribute('fetchpriority');
  });

  it('loads the priority (LCP) image eagerly at high priority', () => {
    render(<ResponsiveImage image={image} alt={alt} sizes={sizes} priority />);
    const img = screen.getByRole('img', { name: alt });
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).not.toHaveAttribute('decoding');
  });

  it('requires alt text at the type level', () => {
    // `pnpm typecheck` fails if alt ever becomes optional (unused directive).
    // @ts-expect-error alt is required
    const element = <ResponsiveImage image={image} sizes={sizes} />;
    expect(element).toBeTruthy();
  });
});
