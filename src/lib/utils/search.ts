export interface SearchEntry {
  id: string;
  group: "Pages" | "Work" | "Labs" | "Journal" | "Actions";
  label: string;
  description?: string;
  href?: string;
  keywords?: string[];
}

export interface SearchMatch<T extends SearchEntry = SearchEntry> {
  entry: T;
  score: number;
  /** Indices into `entry.label` that matched, for highlighting. */
  indices: number[];
}

const WORD_BOUNDARY = /[\s\-_/.·]/;

/**
 * Subsequence fuzzy match against a label, scored the way people read:
 * consecutive runs and word starts beat scattered hits; earlier beats later.
 * Returns null when not every query character can be found in order.
 */
export function fuzzyMatch(query: string, text: string): { score: number; indices: number[] } | null {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (!q) return { score: 0, indices: [] };

  const indices: number[] = [];
  let score = 0;
  let cursor = 0;
  let run = 0;

  for (const char of q) {
    if (char === " ") continue;
    const found = t.indexOf(char, cursor);
    if (found === -1) return null;

    const atWordStart = found === 0 || WORD_BOUNDARY.test(t[found - 1]);
    const consecutive = indices.length > 0 && found === indices[indices.length - 1] + 1;

    run = consecutive ? run + 1 : 0;
    score += 1 + run * 2 + (atWordStart ? 4 : 0) - Math.min(found - cursor, 6) * 0.25;

    indices.push(found);
    cursor = found + 1;
  }

  // Prefer shorter labels and matches that begin early.
  score -= indices[0] * 0.1 + t.length * 0.02;
  return { score, indices };
}

export function search<T extends SearchEntry>(entries: T[], query: string, limit = 24): SearchMatch<T>[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return entries.slice(0, limit).map((entry) => ({ entry, score: 0, indices: [] }));
  }

  const results: SearchMatch<T>[] = [];

  for (const entry of entries) {
    const onLabel = fuzzyMatch(trimmed, entry.label);
    if (onLabel) {
      results.push({ entry, score: onLabel.score + 10, indices: onLabel.indices });
      continue;
    }

    // Fall back to plain substring hits on secondary text, without highlighting.
    const haystack = [entry.description, entry.group, ...(entry.keywords ?? [])].join(" ").toLowerCase();
    const tokens = trimmed.toLowerCase().split(/\s+/);
    if (tokens.every((token) => haystack.includes(token))) {
      results.push({ entry, score: tokens.length, indices: [] });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Splits a label into alternating plain / matched segments for rendering. */
export function highlight(label: string, indices: number[]) {
  const set = new Set(indices);
  const segments: { text: string; match: boolean }[] = [];

  for (let i = 0; i < label.length; i += 1) {
    const match = set.has(i);
    const last = segments[segments.length - 1];
    if (last && last.match === match) last.text += label[i];
    else segments.push({ text: label[i], match });
  }

  return segments;
}
