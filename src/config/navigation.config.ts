export interface NavigationAction {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  accent?: "primary" | "secondary" | "contrast";
}

export interface NavigationGroup {
  title: string;
  items: NavigationAction[];
}

export interface CommandPaletteSection {
  title: string;
  actions: NavigationAction[];
}

export interface NavigationConfig {
  primary: NavigationGroup[];
  commandPalette: CommandPaletteSection[];
  footer: NavigationGroup[];
}

export const navigationConfig: NavigationConfig = {
  primary: [
    {
      title: "Studio",
      items: [
        {
          label: "Experience",
          href: "/",
          description: "Dive into the Mk.01 runway.",
        },
        {
          label: "Work",
          href: "/work",
          description: "Featured case studies and builds.",
        },
        {
          label: "Portfolio",
          href: "/portfolio",
          description: "Extended gallery of launches.",
        },
        {
          label: "Labs",
          href: "/labs",
          description: "Experimental prototypes & R&D.",
        },
        {
          label: "Services",
          href: "/services",
          description: "Engagement models and rituals.",
        },
      ],
    },
    {
      title: "Narratives",
      items: [
        {
          label: "Journal",
          href: "/blog",
          description: "Essays, notes, and process breakdowns.",
        },
        {
          label: "About",
          href: "/about",
          description: "Culture, team constellation, ethos.",
        },
        {
          label: "Team",
          href: "/team",
          description: "Meet the people behind Mk.01.",
        },
        {
          label: "Contact",
          href: "/contact",
          description: "Start a project or collaboration.",
        },
      ],
    },
  ],
  commandPalette: [
    {
      title: "Navigate",
      actions: [
        { label: "Home", href: "/" },
        { label: "View work", href: "/work" },
        { label: "View portfolio", href: "/portfolio" },
        { label: "Open labs", href: "/labs" },
        { label: "Read journal", href: "/blog" },
        { label: "Meet the studio", href: "/about" },
        { label: "Meet the team", href: "/team" },
        { label: "Services", href: "/services" },
        { label: "Contact us", href: "/contact", accent: "primary" },
      ],
    },
  ],
  footer: [
    {
      title: "Explore",
      items: [
        { label: "Capabilities", href: "/capabilities" },
        { label: "Services", href: "/services" },
        { label: "Team", href: "/team" },
        { label: "Stack", href: "/stack" },
        { label: "Open Source", href: "/open-source" },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ],
};
