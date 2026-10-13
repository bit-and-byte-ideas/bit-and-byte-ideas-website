import type { ReactNode } from 'react';
import './page-header.css';

export interface PageHeaderProps {
  /** `// label` kicker above the title. */
  label?: string;
  title: string;
  /** Trailing words set in the accent color, like the section titles. */
  titleAccent?: string;
  dek?: string;
  /** Above the kicker: back link, kind badge, status tags. */
  before?: ReactNode;
  /** Below the dek: article byline, dates, tags. */
  children?: ReactNode;
}

/** Header for content pages (/work, /blog): the page's only H1. */
export function PageHeader({ label, title, titleAccent, dek, before, children }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-atmosphere" aria-hidden="true" />
      <div className="container page-header-inner">
        {before && <div className="page-header-before">{before}</div>}
        {label && <p className="section-label">{label}</p>}
        <h1 className="page-header-title">
          {title}
          {titleAccent && (
            <>
              {' '}
              <em>{titleAccent}</em>
            </>
          )}
        </h1>
        {dek && <p className="page-header-dek">{dek}</p>}
        {children}
      </div>
    </header>
  );
}
