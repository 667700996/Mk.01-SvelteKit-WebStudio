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

const range = (start: number, length: number) => Array.from({ length }, (_, i) => start + i);

/**
 * Matches a query against a label in three tiers, the way people read:
 *   1. the whole query as a substring ("playbook")       — strongest
 *   2. every word of the query as a substring ("launch book")
 *   3. a subsequence with real runs or acronym hits ("dsht" → Design Systems for High…)
 * Word starts, consecutive runs, and early positions all add weight.
 * Returns null when the label doesn't plausibly match.
 */
export function fuzzyMatch(query: string, text: string): { score: number; indices: number[] } | null {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return { score: 0, indices: [] };

  const atWordStart = (index: number) => index === 0 || WORD_BOUNDARY.test(t[index - 1]);

  const whole = t.indexOf(q);
  if (whole !== -1) {
    return {
      score: 100 + (atWordStart(whole) ? 20 : 0) - whole * 0.2 - t.length * 0.02,
      indices: range(whole, q.length),
    };
  }

  const words = q.split(/\s+/);
  if (words.length > 1) {
    const hits = words.map((word) => t.indexOf(word));
    if (hits.every((hit) => hit !== -1)) {
      const starts = hits.filter(atWordStart).length;
      return {
        score: 60 + starts * 6 - t.length * 0.02,
        indices: hits.flatMap((hit, i) => range(hit, words[i].length)),
      };
    }
  }

  const indices: number[] = [];
  let score = 0;
  let cursor = 0;
  let run = 0;
  let longestRun = 0;

  for (const char of q.replace(/\s+/g, "")) {
    const found = t.indexOf(char, cursor);
    if (found === -1) return null;

    const consecutive = indices.length > 0 && found === indices[indices.length - 1] + 1;
    run = consecutive ? run + 1 : 1;
    longestRun = Math.max(longestRun, run);
    score += 1 + (run - 1) * 2 + (atWordStart(found) ? 4 : 0) - Math.min(found - cursor, 6) * 0.25;

    indices.push(found);
    cursor = found + 1;
  }

  // Reject scattered noise: require a real run of characters, or an acronym.
  const acronym = indices.every(atWordStart);
  if (longestRun < Math.min(indices.length, 3) && !acronym) return null;

  return { score: score - indices[0] * 0.1 - t.length * 0.02, indices };
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
      results.push({ entry, score: onLabel.score + 20, indices: onLabel.indices });
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
