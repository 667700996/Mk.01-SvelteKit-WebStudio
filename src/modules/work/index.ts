export interface WorkProject {
  slug: string;
  title: string;
  coverImage: string;
  summary: string;
  year: string;
  tags: string[];
  industry: string;
  accent?: string;
}

export const sampleProjects: WorkProject[] = [
  {
    slug: "neon-metropolis",
    title: "Kinesis",
    coverImage: "/images/work/neon-metropolis-cover.jpg",
    summary:
      "A living identity that behaves less like a logo and more like a force of nature.",
    year: "2026",
    tags: ["WebGL", "Spatial Identity", "Motion"],
    industry: "Culture & Technology",
  },
  {
    slug: "atlas-labs",
    title: "Aether",
    coverImage: "/images/work/atlas-labs-cover.jpg",
    summary:
      "Invisible infrastructure translated into a precise, cinematic product experience.",
    year: "2025",
    tags: ["Product Narrative", "Systems", "Accessibility"],
    industry: "Infrastructure",
  },
  {
    slug: "flowstate",
    title: "Mono/R",
    coverImage: "/images/work/flowstate-cover.jpg",
    summary:
      "An adaptive focus system where motion responds to human rhythm.",
    year: "2025",
    tags: ["Product Design", "Adaptive Motion", "Prototype"],
    industry: "Human Performance",
  },
];
