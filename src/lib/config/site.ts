export const siteConfig = {
  name: "MK.01 — Creative Technologist & Product Engineer",
  shortName: "MK.01",
  description:
    "A design engineering portfolio exploring digital products, interactive systems, WebGL, and motion with production-grade rigor.",
  url: {
    origin: "https://mk1.studio",
    basePath: "",
  },
  keywords: [
    "creative technologist",
    "design engineer",
    "product engineer",
    "interactive design",
    "WebGL",
    "SvelteKit",
    "motion systems",
    "digital product design",
  ],
  social: {
    twitter: "mk1studio",
    github: "mk1-lab",
    dribbble: "mk1studio",
    linkedin: "company/mk1-studio",
  },
  contactEmail: "studio@mk1.dev",
  language: "en",
  locale: "en_US",
};

export function absoluteUrl(path = "/") {
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url.origin}${siteConfig.url.basePath}${trimmed}`;
}
