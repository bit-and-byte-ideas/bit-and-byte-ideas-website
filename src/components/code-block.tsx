import type { ReactNode } from 'react';
import { codeLanguageNames, contentLabels } from '../content/content-labels';
import './code-block.css';

export interface CodeBlockProps {
  /** Fence language from the Markdown (`ts`, `go`, `text`, …). */
  language: string;
  /** The highlighted <code> element (class-based spans, no inline styles). */
  children: ReactNode;
}

/**
 * A fenced code example. The <pre> is focusable so keyboard users can scroll
 * long lines, and named after its language; the visible tag repeats the name
 * for sighted readers and is hidden from assistive tech.
 */
export function CodeBlock({ language, children }: CodeBlockProps) {
  const name = codeLanguageNames[language] ?? language;
  return (
    <div className="code-block">
      <p className="code-block-language" aria-hidden="true">
        {name}
      </p>
      <pre className="code-block-pre" tabIndex={0} role="group" aria-label={contentLabels.code(name)}>
        {children}
      </pre>
    </div>
  );
}
