import { useId } from 'react';
import { Link } from 'react-router';
import type { ArticleDetail } from '../content/collections/blog-view.ts';
import { blogPage } from '../content/blog-page';
import './author-box.css';

/** Who wrote this: name, role, a one-line bio from /about, and the profile link. */
export function AuthorBox({ author }: { author: ArticleDetail['author'] }) {
  const headingId = useId();
  return (
    <section className="author-box" aria-labelledby={headingId}>
      <h2 id={headingId} className="heading-label">
        {blogPage.authorLabel}
      </h2>
      <p className="author-box-name">
        {author.name}
        <span className="author-box-role">{author.role}</span>
      </p>
      <p className="author-box-bio">{author.bio}</p>
      <Link to={author.url} className="author-box-link">
        {blogPage.authorLink(author.name)}
        {' '}
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
