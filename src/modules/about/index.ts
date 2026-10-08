/** Portraits are rendered as typographic monograms; no image assets required. */
export interface TeamMember {
  name: string;
  title: string;
  location: string;
  specialties: string[];
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export const team: TeamMember[] = [
  {
    name: "이준호",
    title: "Founder · Creative Technologist",
    location: "Seoul, KR",
    specialties: ["Experience Engineering", "3D Web", "Motion Systems"],
  },
  {
    name: "Mira Park",
    title: "Design Director",
    location: "Busan, KR",
    specialties: ["Narrative UX", "Design Systems", "Accessibility"],
  },
  {
    name: "Ethan Cho",
    title: "Head of Labs",
    location: "Tokyo, JP",
    specialties: ["Creative R&D", "Realtime Collaboration", "AI Prototyping"],
  },
  {
    name: "Sara Min",
    title: "Lead Product Engineer",
    location: "Seoul, KR",
    specialties: ["Svelte Architecture", "Edge Compute", "Tooling"],
  },
];

export const studioTimeline: TimelineItem[] = [
  {
    year: "2020",
    title: "Mk.01 Origins",
    description:
      "Launched as a solo craft, shipping experimental Svelte prototypes that gained global attention.",
  },
  {
    year: "2021",
    title: "Studio Expansion",
    description:
      "Scaled into a multi-disciplinary collective delivering launches for entertainment & fintech brands.",
  },
  {
    year: "2022",
    title: "Labs Initiative",
    description:
      "Opened Mk.01 Labs—an R&D playground exploring AI, WebGL, and experiential storytelling.",
  },
  {
    year: "2023",
    title: "Systems Era",
    description:
      "Rolled out modular design systems across enterprise partners; introduced the Mk.01 component library.",
  },
  {
    year: "2024",
    title: "Global Recognitions",
    description:
      "Honored with Awwwards recognitions, speaking engagements, and expanded our distributed partner network.",
  },
];
