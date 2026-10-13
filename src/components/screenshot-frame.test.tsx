import { render, screen, within } from '@testing-library/react';
import type { ResolvedImage } from '../content/collections/media.ts';
import { ScreenshotFrame } from './screenshot-frame';

const image: ResolvedImage = {
  width: 2880,
  height: 1800,
  src: '/media/work/example/home-1200.abcd1234.webp',
  avifSrcSet: '/media/work/example/home-1200.abcd1234.avif 1200w',
  webpSrcSet: '/media/work/example/home-1200.abcd1234.webp 1200w',
};
const alt = 'Example homepage with the booking button above the fold';

describe('ScreenshotFrame', () => {
  it('wraps the screenshot and its caption in a figure', () => {
    // Browsers name a figure from its figcaption; jsdom doesn't, so assert structure.
    render(<ScreenshotFrame image={image} alt={alt} sizes="100vw" caption="The new homepage" />);
    const figure = screen.getByRole('figure');
    expect(figure).toContainElement(screen.getByRole('img', { name: alt }));
    expect(within(figure).getByText('The new homepage').tagName).toBe('FIGCAPTION');
  });

  it('crops to the frame ratio by default', () => {
    render(<ScreenshotFrame image={image} alt={alt} sizes="100vw" />);
    expect(screen.getByRole('figure')).toHaveClass('screenshot-frame--crop');
  });

  it('shows the whole screenshot in natural mode', () => {
    render(<ScreenshotFrame image={image} alt={alt} sizes="100vw" mode="natural" />);
    expect(screen.getByRole('figure')).toHaveClass('screenshot-frame--natural');
  });

  it('omits the caption element when there is no caption', () => {
    const { container } = render(<ScreenshotFrame image={image} alt={alt} sizes="100vw" />);
    expect(container.querySelector('figcaption')).toBeNull();
  });

  it('passes priority through to the image', () => {
    render(<ScreenshotFrame image={image} alt={alt} sizes="100vw" priority />);
    expect(screen.getByRole('img', { name: alt })).toHaveAttribute('fetchpriority', 'high');
  });
});
