import { useId } from 'react';
import './empty-state.css';

/**
 * Deliberate empty state for a collection with nothing published yet: an empty
 * screenshot frame (same matte and registration marks as ScreenshotFrame)
 * holding an honest message, never placeholder work.
 */
export function EmptyState({ heading, body }: { heading: string; body: string }) {
  const headingId = useId();
  return (
    <section className="empty-state" aria-labelledby={headingId}>
      <div className="container">
        <div className="empty-state-frame">
          <h2 id={headingId} className="empty-state-heading">
            {heading}
          </h2>
          <p className="empty-state-body">{body}</p>
        </div>
      </div>
    </section>
  );
}
