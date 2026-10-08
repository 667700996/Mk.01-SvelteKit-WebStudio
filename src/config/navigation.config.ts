export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

/** The five destinations that matter. Everything else lives in the footer. */
export const primaryNav: NavLink[] = [
  { label: "Work", href: "/work", description: "Selected case studies" },
  { label: "Labs", href: "/labs", description: "Experiments and R&D" },
  { label: "Journal", href: "/blog", description: "Essays and process notes" },
  { label: "About", href: "/about", description: "Profile and principles" },
  { label: "Contact", href: "/contact", description: "Start a conversation" },
];

export const footerNav: NavGroup[] = [
  {
    title: "Index",
    links: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Labs", href: "/labs" },
      { label: "Journal", href: "/blog" },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Capabilities", href: "/capabilities" },
      { label: "Team", href: "/team" },
      { label: "Stack", href: "/stack" },
      { label: "Open source", href: "/open-source" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "RSS", href: "/rss.xml" },
    ],
  },
];

/** Pages surfaced in the command palette alongside projects, labs and posts. */
export const paletteNav: NavLink[] = [
  { label: "Home", href: "/", description: "Digital matter, engineered." },
  ...primaryNav,
  { label: "Portfolio", href: "/portfolio", description: "All case studies" },
  { label: "Services", href: "/services", description: "Engagement models" },
  { label: "Capabilities", href: "/capabilities", description: "What the practice covers" },
  { label: "Team", href: "/team", description: "The people behind Mk.01" },
  { label: "Stack", href: "/stack", description: "Tools and platforms" },
  { label: "Open source", href: "/open-source", description: "Libraries and starters" },
];
