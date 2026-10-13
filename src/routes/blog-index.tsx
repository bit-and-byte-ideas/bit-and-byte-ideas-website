import { useLoaderData, type MetaArgs } from 'react-router';
import { ArticleCard } from '../components/article-card';
import { CtaBand } from '../components/cta-band';
import { EmptyState } from '../components/empty-state';
import { PageHeader } from '../components/page-header';
import { orderArticles, toArticleSummary } from '../content/collections/blog-view.ts';
import { loadContent } from '../content/collections/load.server.ts';
import { blogPage } from '../content/blog-page';
import { pageMeta } from '../content/seo';
import './blog-index.css';

// Runs at build time only (ssr: false + prerender); content never ships as code.
export function loader() {
  return { articles: orderArticles(loadContent().blog).map(toArticleSummary) };
}

export function meta({ loaderData }: MetaArgs<typeof loader>) {
  const articles = loaderData?.articles ?? [];
  return pageMeta({
    title: blogPage.meta.title,
    description: blogPage.meta.description,
    path: '/blog',
    // An empty list, or one with only drafts and fixtures, is nothing to index.
    noIndex: articles.every((article) => article.fixture || article.status === 'draft'),
  });
}

export default function BlogIndex() {
  const { articles } = useLoaderData<typeof loader>();
  return (
    <>
      <PageHeader
        label={blogPage.label}
        title={blogPage.title}
        titleAccent={blogPage.titleAccent}
        dek={articles.length > 0 ? blogPage.dek : undefined}
      />
      {articles.length > 0 ? (
        <section className="blog-list" aria-label={blogPage.listLabel}>
          <div className="container">
            <ul role="list" className="article-list blog-list-items">
              {articles.map((article) => (
                <li key={article.slug}>
                  <ArticleCard article={article} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <EmptyState heading={blogPage.empty.heading} body={blogPage.empty.body} />
      )}
      <CtaBand label={blogPage.cta.label} heading={blogPage.cta.heading} />
    </>
  );
}
