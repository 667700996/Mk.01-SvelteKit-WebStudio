import { absoluteUrl, siteConfig } from "$lib/config/site";
import { getAllPosts } from "$lib/server/content";

export const prerender = true;

const escape = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`);

export function GET() {
  const items = getAllPosts()
    .map(
      (post) => `
    <item>
      <title>${escape(post.title)}</title>
      <link>${absoluteUrl(`/blog/${post.slug}`)}</link>
      <guid>${absoluteUrl(`/blog/${post.slug}`)}</guid>
      <description>${escape(post.description)}</description>
      ${post.date ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : ""}
      <category>${escape(post.category)}</category>
    </item>`,
    )
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteConfig.shortName)} Journal</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>${escape(siteConfig.description)}</description>
    <language>${siteConfig.language}</language>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
