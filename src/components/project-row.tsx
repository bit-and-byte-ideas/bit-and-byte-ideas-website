import { Link } from 'react-router';
import type { WorkSummary } from '../content/collections/work-view.ts';
import { ContentStatusTag } from './content-status';
import { KindBadge } from './kind-badge';
import { ScreenshotFrame } from './screenshot-frame';
import './project-row.css';

export interface ProjectRowProps {
  project: WorkSummary;
  /** Visual cue under the summary ("Read the case study"); the title is the link. */
  cue: string;
  /** The first row's cover is the page's LCP image. */
  priority?: boolean;
}

/**
 * One project in the /work list: screenshot leads, text beside it. The title
 * link stretches over the whole row, so the row is one large target with one
 * accessible name.
 */
export function ProjectRow({ project, cue, priority = false }: ProjectRowProps) {
  return (
    <article className="project-row">
      {project.cover && (
        <div className="project-row-media">
          <ScreenshotFrame
            image={project.cover.image}
            alt={project.cover.alt}
            sizes="(min-width: 1200px) 640px, (min-width: 900px) 55vw, 100vw"
            priority={priority}
          />
        </div>
      )}
      <div className="project-row-body">
        <div className="project-row-tags">
          <KindBadge kind={project.kind} label={project.kindLabel} />
          <ContentStatusTag entry={project} />
        </div>
        <h2 className="project-row-title">
          <Link to={`/work/${project.slug}`} className="project-row-link">
            {project.title}
          </Link>
        </h2>
        <p className="project-row-summary">{project.summary}</p>
        <p className="project-row-meta">
          {project.industry}
          <span aria-hidden="true"> · </span>
          {project.categoryLabel}
        </p>
        <span className="project-row-cue" aria-hidden="true">
          {cue}
        </span>
      </div>
    </article>
  );
}
