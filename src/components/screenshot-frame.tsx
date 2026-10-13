import { ResponsiveImage, type ResponsiveImageProps } from './responsive-image';
import './screenshot-frame.css';

export interface ScreenshotFrameProps extends ResponsiveImageProps {
  /**
   * `crop`: fixed --frame-ratio window anchored to the top of the page (cards, rows).
   * `natural`: the whole screenshot at its own ratio (project galleries).
   */
  mode?: 'crop' | 'natural';
  caption?: string;
}

/**
 * Matte frame for authentic website screenshots: hairline border, surface
 * matte, and the brand's registration marks. No imitation browser chrome.
 */
export function ScreenshotFrame({ mode = 'crop', caption, ...image }: ScreenshotFrameProps) {
  return (
    <figure className={`screenshot-frame screenshot-frame--${mode}`}>
      <div className="screenshot-frame-matte">
        <ResponsiveImage {...image} />
      </div>
      {caption && <figcaption className="screenshot-frame-caption">{caption}</figcaption>}
    </figure>
  );
}
