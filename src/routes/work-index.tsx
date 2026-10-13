import { useLoaderData, type MetaArgs } from 'react-router';
import { CtaBand } from '../components/cta-band';
import { EmptyState } from '../components/empty-state';
import { PageHeader } from '../components/page-header';
import { ProjectRow } from '../components/project-row';
import { entryImage, loadContent } from '../content/collections/load.server.ts';
import { orderProjects, toWorkSummary } from '../content/collections/work-view.ts';
import { pageMeta } from '../content/seo';
import { workPage } from '../content/work-page';
import './work-index.css';

// Runs at build time only (ssr: false + prerender); content never ships as code.
export function loader() {
  const projects = orderProjects(loadContent().work).map((entry) =>
    toWorkSummary(entry, (file) => entryImage(entry, file)),
  );
  return { projects };
}

export function meta({ loaderData }: MetaArgs<typeof loader>) {
  const projects = loaderData?.projects ?? [];
  return pageMeta({
    title: workPage.meta.title,
    description: workPage.meta.description,
    path: '/work',
    // An empty list, or one with only drafts and fixtures, is nothing to index.
    noIndex: projects.every((project) => project.fixture || project.status === 'draft'),
  });
}

export default function WorkIndex() {
  const { projects } = useLoaderData<typeof loader>();
  return (
    <>
      <PageHeader
        label={workPage.label}
        title={workPage.title}
        titleAccent={workPage.titleAccent}
        dek={projects.length > 0 ? workPage.dek : undefined}
      />
      {projects.length > 0 ? (
        <section className="work-list" aria-label={`${workPage.title} ${workPage.titleAccent}`}>
          <div className="container">
            <ul role="list" className="work-list-items">
              {projects.map((project, index) => (
                <li key={project.slug}>
                  <ProjectRow project={project} cue={workPage.viewProject} priority={index === 0} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <EmptyState heading={workPage.empty.heading} body={workPage.empty.body} />
      )}
      <CtaBand label={workPage.cta.label} heading={workPage.cta.heading} />
    </>
  );
}
