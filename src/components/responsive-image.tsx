import type { ResolvedImage } from '../content/collections/media.ts';
import './responsive-image.css';

export interface ResponsiveImageProps {
  /** Variant data resolved by the route loader from the media manifest. */
  image: ResolvedImage;
  /** What the image shows. Required: content images are never decorative. */
  alt: string;
  /** Rendered width hints for variant selection, e.g. "(min-width: 900px) 58vw, 100vw". */
  sizes: string;
  /** The one above-the-fold (LCP) image on a page: loads eagerly at high priority. */
  priority?: boolean;
}

/**
 * AVIF first, WebP fallback, explicit dimensions so the browser reserves the
 * space before the file arrives (no layout shift).
 */
export function ResponsiveImage({ image, alt, sizes, priority = false }: ResponsiveImageProps) {
  return (
    <picture className="responsive-image">
      <source type="image/avif" srcSet={image.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={image.webpSrcSet} sizes={sizes} />
      <img
        src={image.src}
        srcSet={image.webpSrcSet}
        sizes={sizes}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? undefined : 'async'}
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  );
}
