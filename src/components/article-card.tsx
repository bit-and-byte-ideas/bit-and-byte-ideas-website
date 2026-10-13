import { Fragment } from 'react';
import { Link } from 'react-router';
import type { ArticleSummary } from '../content/collections/blog-view.ts';
import { blogPage } from '../content/blog-page';
import { ContentStatusTag } from './content-status';
import './article-card.css';

export interface ArticleCardProps {
  article: ArticleSummary;
  /** H2 on /blog; H3 under the "Related articles" heading. */
  headingLevel?: 2 | 3;
}

/**
 * One article in a list: title link, date and reading time, description, and
 * topics as plain text. The title link stretches over the whole row.
 */
export function ArticleCard({ article, headingLevel = 2 }: ArticleCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="article-card">
      <Heading className="article-card-title">
        <Link to={`/blog/${article.slug}`} className="article-card-link">
          {article.title}
        </Link>
      </Heading>
      <p className="article-card-meta">
        {article.publishedOn && (
          <time className="article-card-date" dateTime={article.publishedOn.iso}>
            {article.publishedOn.label}
          </time>
        )}
        <span className="article-card-minutes">{blogPage.minutesRead(article.readingMinutes)}</span>
        <ContentStatusTag entry={article} />
      </p>
      <p className="article-card-description">{article.description}</p>
      <p className="article-card-tags">
        <span className="sr-only">{blogPage.tagsLabel}: </span>
        {article.tags.map((tag, index) => (
          <Fragment key={tag}>
            {index > 0 && <span aria-hidden="true"> · </span>}
            {tag}
          </Fragment>
        ))}
      </p>
    </article>
  );
}
