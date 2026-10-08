import { render } from "svelte/server";
import type { Component } from "svelte";

/** Frontmatter as authored. Older entries use `excerpt` and string reading times. */
interface RawFrontmatter {
  title?: string;
  date?: string | Date;
  description?: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
  author?: string;
  draft?: boolean;
  readingTime?: number | string;
  [key: string]: unknown;
}

interface PostModule {
  metadata?: RawFrontmatter;
  default: Component;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  readingTime: number;
  wordCount: number;
  draft: boolean;
}

const WORDS_PER_MINUTE = 220;

// Both collections are eagerly bundled server-side: they are tiny, and this
// avoids a waterfall of dynamic imports on every journal request.
const modules = {
  ...import.meta.glob<PostModule>("/src/posts/*.md", { eager: true }),
  ...import.meta.glob<PostModule>("/src/content/articles/*.mdx", { eager: true }),
};

function slugFromPath(path: string) {
  return path.split("/").pop()!.replace(/\.mdx?$/, "");
}

function toIsoDate(value: unknown): string {
  const date = value instanceof Date ? value : typeof value === "string" ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString() : "";
}

function countWords(component: Component) {
  const { body } = render(component);
  const text = body
    .replace(/<pre[\s\S]*?<\/pre>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .trim();
  return text ? text.split(/\s+/).length : 0;
}

function normalise(path: string, mod: PostModule): Post {
  const meta = mod.metadata ?? {};
  const wordCount = countWords(mod.default);
  const declaredMinutes = Number.parseInt(String(meta.readingTime ?? ""), 10);

  return {
    slug: slugFromPath(path),
    title: meta.title ?? slugFromPath(path),
    date: toIsoDate(meta.date),
    description: meta.description ?? meta.excerpt ?? "",
    category: meta.category ?? "Uncategorized",
    tags: Array.isArray(meta.tags) ? meta.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
    author: meta.author ?? "Mk.01 Studio",
    readingTime: Number.isFinite(declaredMinutes)
      ? declaredMinutes
      : Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
    wordCount,
    draft: meta.draft === true,
  };
}

const posts: Post[] = Object.entries(modules)
  .map(([path, mod]) => normalise(path, mod))
  .filter((post) => !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  return posts.find((post) => post.slug === slug) ?? null;
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return posts
    .filter((entry) => entry.slug !== post.slug)
    .map((entry) => ({
      entry,
      score:
        (entry.category === post.category ? 2 : 0) +
        entry.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.entry.date.localeCompare(a.entry.date))
    .slice(0, limit)
    .map(({ entry }) => entry);
}

export function getCategories(): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  return [...counts]
    .map(([name, count]) => ({ name, slug: name.toLowerCase(), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
