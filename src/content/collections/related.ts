export interface RelatedCandidate {
  slug: string;
  tags: readonly string[];
  /** YYYY-MM-DD; ISO dates sort correctly as strings. */
  publishedOn: string;
}

export const RELATED_LIMIT = 3;

/**
 * Other articles ranked by shared tags (at least one), then newest first,
 * then slug for a stable order (D-021).
 */
export function relatedArticles<T extends RelatedCandidate>(
  current: RelatedCandidate,
  candidates: readonly T[],
  limit = RELATED_LIMIT,
): T[] {
  const tags = new Set(current.tags);
  return candidates
    .filter((candidate) => candidate.slug !== current.slug)
    .map((candidate) => ({
      candidate,
      shared: candidate.tags.filter((tag) => tags.has(tag)).length,
    }))
    .filter(({ shared }) => shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        b.candidate.publishedOn.localeCompare(a.candidate.publishedOn) ||
        a.candidate.slug.localeCompare(b.candidate.slug),
    )
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
