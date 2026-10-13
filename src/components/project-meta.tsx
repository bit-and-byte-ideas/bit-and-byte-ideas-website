import type { WorkDetail } from '../content/collections/work-view.ts';
import './project-meta.css';

export interface ProjectMetaLabels {
  label: string;
  industry: string;
  category: string;
  services: string;
  technologies: string;
  completed: string;
  live: string;
  liveLink: string;
}

/** Project facts as a description list; the live link only appears when approved and present. */
export function ProjectMeta({ project, labels }: { project: WorkDetail; labels: ProjectMetaLabels }) {
  return (
    <aside className="project-meta" aria-label={labels.label}>
      <dl className="project-meta-list">
        <div className="project-meta-item">
          <dt>{labels.industry}</dt>
          <dd>{project.industry}</dd>
        </div>
        <div className="project-meta-item">
          <dt>{labels.category}</dt>
          <dd>{project.categoryLabel}</dd>
        </div>
        <div className="project-meta-item">
          <dt>{labels.services}</dt>
          <dd>
            <ul role="list">
              {project.serviceLabels.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="project-meta-item">
          <dt>{labels.technologies}</dt>
          <dd>
            <ul role="list" className="project-meta-inline">
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </dd>
        </div>
        {project.completedOn && (
          <div className="project-meta-item">
            <dt>{labels.completed}</dt>
            <dd>
              <time dateTime={project.completedOn.iso}>{project.completedOn.label}</time>
            </dd>
          </div>
        )}
        {project.liveUrl && (
          <div className="project-meta-item">
            <dt>{labels.live}</dt>
            <dd>
              <a
                href={project.liveUrl}
                className="project-meta-live"
                target="_blank"
                rel="noopener noreferrer"
              >
                {labels.liveLink}
                <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}
