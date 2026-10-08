import { absoluteUrl, siteConfig } from "$lib/config/site";

type SeoType = "website" | "article";

export type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string | null;
  noindex?: boolean;
  type?: SeoType;
  tags?: string[];
  publishedTime?: string | null;
  modifiedTime?: string | null;
  locale?: string;
};

export type SeoResult = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  meta: { name: string; content: string }[];
  openGraph: { property: string; content: string }[];
  twitter: { name: string; content: string }[];
  jsonLd: Record<string, unknown> | null;
};

function resolveImageUrl(image?: string | null) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  return absoluteUrl(image);
}

export function buildSeo(options: SeoInput = {}): SeoResult {
  const {
    title,
    description = siteConfig.description,
    path = "/",
    image = "/og.png",
    noindex = false,
    type = "website",
    tags = [],
    publishedTime,
    modifiedTime,
    locale = siteConfig.locale,
  } = options;

  const pageTitle = title
    ? `${title} · ${siteConfig.shortName}`
    : siteConfig.name;
  const canonical = absoluteUrl(path);
  const robots = noindex ? "noindex, nofollow" : "index, follow";
  const ogImage = resolveImageUrl(image);
  const openGraphType = type === "article" ? "article" : "website";

  const meta: SeoResult["meta"] = [
    { name: "keywords", content: siteConfig.keywords.join(", ") },
  ];

  const openGraph: SeoResult["openGraph"] = [
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: openGraphType },
    { property: "og:url", content: canonical },
    { property: "og:site_name", content: siteConfig.name },
    { property: "og:locale", content: locale },
  ];

  if (ogImage) {
    openGraph.push({ property: "og:image", content: ogImage });
    if (ogImage === absoluteUrl("/og.png")) {
      openGraph.push(
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "MK.01 — Digital matter, engineered." },
      );
    }
  }

  if (openGraphType === "article") {
    if (publishedTime) {
      openGraph.push({
        property: "article:published_time",
        content: publishedTime,
      });
    }
    if (modifiedTime) {
      openGraph.push({
        property: "article:modified_time",
        content: modifiedTime,
      });
    }
    if (tags.length) {
      tags.slice(0, 6).forEach((tag) => {
        openGraph.push({ property: "article:tag", content: tag });
      });
    }
  }

  const twitter: SeoResult["twitter"] = [
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: pageTitle },
    { name: "twitter:description", content: description },
  ];

  if (siteConfig.social.twitter) {
    twitter.push({
      name: "twitter:site",
      content: `@${siteConfig.social.twitter}`,
    });
    twitter.push({
      name: "twitter:creator",
      content: `@${siteConfig.social.twitter}`,
    });
  }

  if (ogImage) {
    twitter.push({ name: "twitter:image", content: ogImage });
  }

  let jsonLd: SeoResult["jsonLd"] = null;

  if (type === "article") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: pageTitle,
      description,
      image: ogImage ?? undefined,
      datePublished: publishedTime ?? undefined,
      dateModified: modifiedTime ?? publishedTime ?? undefined,
      author: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url.origin,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: {
          "@type": "ImageObject",
          url: ogImage ?? absoluteUrl("/favicon.svg"),
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonical,
      },
      keywords: tags.join(", "),
    };
  } else {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      description,
      url: canonical,
    };
  }

  return {
    title: pageTitle,
    description,
    canonical,
    robots,
    meta,
    openGraph,
    twitter,
    jsonLd,
  };
}
