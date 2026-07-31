export type Locale = "en" | "ko";

export interface StudioIdentity {
  name: string;
  tagline: string;
  description: string;
  primaryLocale: Locale;
  locales: Locale[];
  contactEmail: string;
  socials: {
    label: string;
    url: string;
    handle?: string;
  }[];
}

export interface StudioMetrics {
  experimentsShipped: string;
  activeCollaborators: string;
  averageSprintLength: string;
  responseTime: string;
}

export interface ExperienceConfig {
  enableAmbientAudio: boolean;
  enableSmoothScroll: boolean;
  defaultTheme: "day" | "night" | "system";
}

export interface AppConfig {
  identity: StudioIdentity;
  metrics: StudioMetrics;
  experience: ExperienceConfig;
}

export const appConfig: AppConfig = {
  identity: {
    name: "MK.01",
    tagline: "Digital matter, engineered.",
    description:
      "The independent practice of a creative technologist and product engineer building expressive, resilient digital systems.",
    primaryLocale: "en",
    locales: ["en", "ko"],
    contactEmail: "studio@mk1.dev",
    socials: [],
  },
  metrics: {
    experimentsShipped: "48+",
    activeCollaborators: "17",
    averageSprintLength: "2 weeks",
    responseTime: "<24h",
  },
  experience: {
    enableAmbientAudio: true,
    enableSmoothScroll: true,
    defaultTheme: "system",
  },
};
