import './content-status.css';

export type ContentStatusKind = 'draft' | 'fixture';

export interface ContentStatusInput {
  status: 'draft' | 'published';
  fixture: boolean;
}

/** Draft wins over fixture; published real content has no status. */
function contentStatus({ status, fixture }: ContentStatusInput): ContentStatusKind | null {
  if (status === 'draft') return 'draft';
  return fixture ? 'fixture' : null;
}

/**
 * Visible marker on drafts and fixtures. Production builds never include
 * either, and scripts/verify-build-content.ts fails if `data-content-status`
 * ever appears in a production page.
 */
export function ContentStatusBanner({
  entry,
  messages,
}: {
  entry: ContentStatusInput;
  messages: Record<ContentStatusKind, string>;
}) {
  const kind = contentStatus(entry);
  if (!kind) return null;
  return (
    <p className="content-status" data-content-status={kind} role="note">
      {messages[kind]}
    </p>
  );
}

/** Compact tag for lists. */
export function ContentStatusTag({ entry }: { entry: ContentStatusInput }) {
  const kind = contentStatus(entry);
  if (!kind) return null;
  return (
    <span className="content-status-tag" data-content-status={kind}>
      {kind === 'draft' ? 'Draft' : 'Fixture'}
    </span>
  );
}
