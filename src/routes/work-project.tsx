/*
 * Direction contract (impeccable). Surface brief: .impeccable/surfaces/src-routes-work-project-tsx.md
 * THESIS: the screenshot is the evidence. The page is a measured case file for one
 * piece of work, not a marketing hero with a thumbnail tucked under it.
 * OWN-WORLD: Engineered Dark as built: navy surfaces, green signal, mono system
 * labels, hairline matte frames with registration marks, Bricolage titles.
 * STORY: the visitor sees what was built, reads why (problem, constraints,
 * approach, solution), checks verified outcomes, then books a call.
 * FIRST VIEWPORT: back link + kind badge, a compact H1 and one-line summary, then
 * the cover screenshot at container width so it fills the lower half of the fold.
 * FORM: case file, the first structure on the list (cover-led, facts rail,
 * sections as prose); staged directly from docs/website/DESIGN.md, no seed roll.
 */
import type { Root } from 'hast';
import {
  data,
  isRouteErrorResponse,
  Link,
  useLoaderData,
  useRouteError,
  type LoaderFunctionArgs,
  type MetaArgs,
} from 'react-router';
import { CaseStudy } from '../components/case-study';
import { ContentStatusBanner } from '../components/content-status';
import { CtaBand } from '../components/cta-band';
import { KindBadge } from '../components/kind-badge';
import { NotFoundContent } from '../components/not-found-content';
import { PageHeader } from '../components/page-header';
import { ProjectMeta } from '../components/project-meta';
import { ScreenshotFrame } from '../components/screenshot-frame';
import { resolveBodyImages } from '../content/collections/body-images.ts';
import { slugFromRequest } from '../content/collections/request-slug.ts';
import { entryImage, loadContent, renderEntry } from '../content/collections/load.server.ts';
import { nextProject, orderProjects, toWorkDetail } from '../content/collections/work-view.ts';
import { pageMeta } from '../content/seo';
import { workPage } from '../content/work-page';
import './work-project.css';

// Runs at build time only (ssr: false + prerender), once per included project.
export function loader({ request }: LoaderFunctionArgs) {
  const ordered = orderProjects(loadContent().work);
  const slug = slugFromRequest(request);
  const entry = ordered.find((candidate) => candidate.slug === slug);
  if (!entry) throw data(null, { status: 404 });
  const imageFor = (file: string) => entryImage(entry, file);
  const { hast } = renderEntry(entry);
  return {
    project: toWorkDetail(entry, imageFor),
    body: hast,
    bodyImages: resolveBodyImages(hast, imageFor),
    next: nextProject(ordered, entry.slug),
  };
}

export function meta({ loaderData }: MetaArgs<typeof loader>) {
  if (!loaderData) {
    return pageMeta({
      title: 'Page Not Found — Bit & Byte Ideas',
      description: "The page you're looking for doesn't exist.",
      path: '/404',
      noIndex: true,
    });
  }
  const { project } = loaderData;
  return pageMeta({
    title: `${project.seo.title ?? project.title} — Bit & Byte Ideas`,
    description: project.seo.description ?? project.summary,
    path: `/work/${project.slug}`,
    noIndex: project.fixture || project.status === 'draft',
  });
}

export default function WorkProject() {
  const { project, body, bodyImages, next } = useLoaderData<typeof loader>();
  const gallery = project.gallery;
  return (
    <article className="work-project">
      <PageHeader
        title={project.title}
        dek={project.summary}
        before={
          <>
            <ContentStatusBanner entry={project} messages={workPage.status} />
            <Link to="/work" className="back-link">
              <span aria-hidden="true">←</span>
              {workPage.backLink}
            </Link>
            <KindBadge kind={project.kind} label={project.kindLabel} />
          </>
        }
      />

      {project.cover && (
        <div className="container work-project-cover">
          <ScreenshotFrame
            image={project.cover.image}
            alt={project.cover.alt}
            caption={project.cover.caption}
            sizes="(min-width: 1200px) 1104px, 100vw"
            mode="natural"
            priority
          />
        </div>
      )}

      <div className="container work-project-body">
        <ProjectMeta project={project} labels={workPage.details} />
        <div className="work-project-main">
          <CaseStudy
            body={body as Root}
            images={bodyImages}
            outcomes={project.outcomes}
            outcomesHeading={workPage.sections.outcomes}
          />
          {gallery.length > 0 && (
            <section className="work-project-gallery" aria-labelledby="gallery-heading">
              <h2 id="gallery-heading">{workPage.sections.gallery}</h2>
              <div className="work-project-gallery-grid">
                {gallery.map((item) => (
                  <div
                    key={item.image.src}
                    className={`work-project-gallery-item work-project-gallery-item--${item.viewport}`}
                  >
                    <ScreenshotFrame
                      image={item.image}
                      alt={item.alt}
                      caption={item.caption}
                      sizes={item.viewport === 'mobile' ? '320px' : '(min-width: 1200px) 800px, 100vw'}
                      mode="natural"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {next && (
        <nav className="work-project-more" aria-label={workPage.more.label}>
          <div className="container work-project-more-inner">
            <p className="section-label">{workPage.more.next}</p>
            <Link to={`/work/${next.slug}`} className="work-project-next">
              {next.title}
              {'\u00a0'}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </nav>
      )}

      <CtaBand label={workPage.cta.label} heading={workPage.cta.heading} />
    </article>
  );
}

/** A 404 from the loader shows the branded page; anything else bubbles up to the root boundary. */
export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundContent />;
  throw error;
}
