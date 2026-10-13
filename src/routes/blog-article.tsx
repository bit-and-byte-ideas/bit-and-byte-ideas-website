/*
 * Direction contract (impeccable). Surface brief: .impeccable/surfaces/src-routes-blog-article-tsx.md
 * THESIS: the text is the product. An engineering note set for long reading,
 * with the site's system grammar kept to the edges (byline strip, code tags, TOC).
 * OWN-WORLD: Engineered Dark as built: navy surfaces, green signal, `// label`
 * terms, hairline rules, Bricolage headings over a Public Sans reading column.
 * STORY: the visitor reads the title and dek, checks who wrote it and when,
 * reads (jumping via the TOC on long pieces), meets the author, and either
 * follows a related article or books a call.
 * FIRST VIEWPORT: back link, H1, dek, and the byline strip; the first lines of
 * the body start above the fold at desktop.
 * FORM: notebook column (Read mode): one --measure-prose column, TOC rail on the
 * left at >= 1100px, no imagery required; staged from docs/website/DESIGN.md.
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
import { ArticleMeta } from '../components/article-meta';
import { AuthorBox } from '../components/author-box';
import { ContentBody } from '../components/content-body';
import { ContentStatusBanner } from '../components/content-status';
import { CtaBand } from '../components/cta-band';
import { NotFoundContent } from '../components/not-found-content';
import { PageHeader } from '../components/page-header';
import { RelatedArticles } from '../components/related-articles';
import { TableOfContents } from '../components/table-of-contents';
import { blogPage } from '../content/blog-page';
import { relatedSummaries, toArticleDetail } from '../content/collections/blog-view.ts';
import { resolveBodyImages } from '../content/collections/body-images.ts';
import { entryImage, loadContent, renderEntry } from '../content/collections/load.server.ts';
import { slugFromRequest } from '../content/collections/request-slug.ts';
import { showToc, tocItems } from '../content/collections/toc.ts';
import { pageMeta } from '../content/seo';
import './blog-article.css';

// Runs at build time only (ssr: false + prerender), once per included article.
export function loader({ request }: LoaderFunctionArgs) {
  const articles = loadContent().blog;
  const slug = slugFromRequest(request);
  const entry = articles.find((candidate) => candidate.slug === slug);
  if (!entry) throw data(null, { status: 404 });
  const { hast, headings } = renderEntry(entry);
  return {
    article: toArticleDetail(entry),
    body: hast,
    bodyImages: resolveBodyImages(hast, (file) => entryImage(entry, file)),
    toc: showToc(headings, entry.data.toc) ? tocItems(headings) : [],
    related: relatedSummaries(entry, articles),
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
  const { article } = loaderData;
  return pageMeta({
    title: `${article.seo.title ?? article.title} — Bit & Byte Ideas`,
    description: article.seo.description ?? article.description,
    path: `/blog/${article.slug}`,
    noIndex: article.fixture || article.status === 'draft',
  });
}

export default function BlogArticle() {
  const { article, body, bodyImages, toc, related } = useLoaderData<typeof loader>();
  const hasToc = toc.length > 0;
  return (
    <article className="blog-article">
      <PageHeader
        title={article.title}
        dek={article.description}
        before={
          <>
            <ContentStatusBanner entry={article} messages={blogPage.status} />
            <Link to="/blog" className="back-link">
              <span aria-hidden="true">←</span>
              {blogPage.backLink}
            </Link>
          </>
        }
      >
        <ArticleMeta article={article} />
      </PageHeader>

      <div className={`container blog-article-layout${hasToc ? ' blog-article-layout--toc' : ''}`}>
        {hasToc && <TableOfContents items={toc} />}
        <div className="blog-article-main">
          <ContentBody
            tree={body as Root}
            images={bodyImages}
            headingAnchors
            className="content-body--article"
          />
          <AuthorBox author={article.author} />
          <RelatedArticles articles={related} />
        </div>
      </div>

      <CtaBand label={blogPage.cta.label} heading={blogPage.cta.heading} />
    </article>
  );
}

/** A 404 from the loader shows the branded page; anything else bubbles up to the root boundary. */
export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundContent />;
  throw error;
}
