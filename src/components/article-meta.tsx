import { Fragment } from 'react';
import { Link } from 'react-router';
import type { ArticleDetail } from '../content/collections/blog-view.ts';
import { blogPage } from '../content/blog-page';
import './article-meta.css';

/**
 * Byline strip under the article title: author (linking their profile),
 * published and updated dates, reading time, and topics, as `// label` terms.
 */
export function ArticleMeta({ article }: { article: ArticleDetail }) {
  return (
    <dl className="article-meta">
      <div className="article-meta-item">
        <dt>{blogPage.byline}</dt>
        <dd>
          <Link to={article.author.url} className="article-meta-author">
            {article.author.name}
          </Link>
        </dd>
      </div>
      {article.publishedOn && (
        <div className="article-meta-item">
          <dt>{blogPage.published}</dt>
          <dd>
            <time dateTime={article.publishedOn.iso}>{article.publishedOn.label}</time>
          </dd>
        </div>
      )}
      {article.updatedOn && (
        <div className="article-meta-item">
          <dt>{blogPage.updated}</dt>
          <dd>
            <time dateTime={article.updatedOn.iso}>{article.updatedOn.label}</time>
          </dd>
        </div>
      )}
      <div className="article-meta-item">
        <dt>{blogPage.readingTime}</dt>
        <dd>{blogPage.minutesRead(article.readingMinutes)}</dd>
      </div>
      <div className="article-meta-item">
        <dt>{blogPage.tagsLabel}</dt>
        <dd>
          {article.tags.map((tag, index) => (
            <Fragment key={tag}>
              {index > 0 && <span aria-hidden="true"> · </span>}
              {tag}
            </Fragment>
          ))}
        </dd>
      </div>
    </dl>
  );
}
