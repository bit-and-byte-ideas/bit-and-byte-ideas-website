import { useId } from 'react';
import type { Root } from 'hast';
import type { ResolvedImage } from '../content/collections/media.ts';
import { ContentBody } from './content-body';
import './case-study.css';

export interface CaseStudyProps {
  /** Body with the four sections (Problem, Constraints, Approach, Solution) as H2s. */
  body: Root;
  images?: Record<string, ResolvedImage>;
  /** Verified outcome statements only; evidence never reaches the page. */
  outcomes: string[];
  outcomesHeading: string;
}

export function CaseStudy({ body, images, outcomes, outcomesHeading }: CaseStudyProps) {
  const outcomesId = useId();
  return (
    <div className="case-study">
      <ContentBody tree={body} images={images} />
      {outcomes.length > 0 && (
        <section className="case-study-outcomes" aria-labelledby={outcomesId}>
          <h2 id={outcomesId}>{outcomesHeading}</h2>
          <ul role="list">
            {outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
