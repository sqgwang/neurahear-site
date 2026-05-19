import { siteConfig } from "./site";

export const contactChannels = [
  {
    label: "Research contact",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    text: "For collaboration, study tools, data workflows, and research enquiries.",
  },
  {
    label: "Institution",
    value: siteConfig.institution,
    href: "https://www.hku.hk/",
    text: "Academic home for the group's hearing science and digital assessment work.",
  },
  {
    label: "Research platform",
    value: siteConfig.shortName,
    href: "/tools/",
    text: "Digital hearing assessment tools, PROM previews, and study workflow prototypes.",
  },
] as const;

export const collaborationTopics = [
  "AI-enabled hearing care and human oversight workflows",
  "Digital hearing assessment tools for research and screening",
  "Speech-in-noise testing, iDIN, and digit stimulus optimization",
  "Everyday functioning PROMs and Mandarin hearing-care measures",
  "Study deployment, data export, and research platform design",
] as const;

export const emailChecklist = [
  "The research question, study context, or collaboration idea",
  "The tool or workflow you are interested in",
  "The language, participant group, and deployment setting",
  "Whether server-backed data capture or browser-only export is needed",
] as const;

export const credibilityNotes = [
  {
    label: "Research record",
    text: "The site links to Scholar-indexed publications and active research profiles so visitors can verify the academic context behind the platform.",
  },
  {
    label: "Tool status",
    text: "Assessment tools are labelled as live, in validation, in development, or restricted to avoid implying clinical readiness where validation is still ongoing.",
  },
  {
    label: "Data boundary",
    text: "Study tools should make browser-only workflows, server-backed records, export routes, and backup requirements visible before use.",
  },
] as const;
