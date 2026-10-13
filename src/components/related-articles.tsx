import { useId } from 'react';
import type { ArticleSummary } from '../content/collections/blog-view.ts';
import { blogPage } from '../content/blog-page';
import { ArticleCard } from './article-card';
import './related-articles.css';

/** Up to three related articles (D-021); renders nothing when none qualify. */
export function RelatedArticles({ articles }: { articles: readonly ArticleSummary[] }) {
  const headingId = useId();
  if (articles.length === 0) return null;
  return (
    <section className="related-articles" aria-labelledby={headingId}>
      <h2 id={headingId} className="heading-label related-articles-heading">
        {blogPage.related}
      </h2>
      <ul role="list" className="article-list">
        {articles.map((article) => (
          <li key={article.slug}>
            <ArticleCard article={article} headingLevel={3} />
          </li>
        ))}
      </ul>
    </section>
  );
}
