import type { WorkKind } from '../content/work-taxonomy.ts';
import './kind-badge.css';

/** "Client project", "Internal project", or "Concept": always as text, never color alone. */
export function KindBadge({ kind, label }: { kind: WorkKind; label: string }) {
  return <span className={`kind-badge kind-badge--${kind}`}>{label}</span>;
}
