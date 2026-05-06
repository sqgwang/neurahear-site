export type NewsType = "Publication" | "Tool" | "Conference" | "Seminar" | "Group update";

export type NewsItem = {
  id: string;
  date: string;
  dateLabel?: string;
  type: NewsType;
  title: string;
  summary: string;
  href?: string;
};

export const RECENT_NEWS_MONTHS = 6;

export const newsItems: NewsItem[] = [
  {
    id: "hfeq-mandarin-preview",
    date: "2026-05-06",
    type: "Tool",
    title: "HFEQ-Mandarin research preview added to the assessment platform",
    summary:
      "A browser-based research-preview workflow now supports HFEQ-Mandarin item entry, raw domain profiling, and JSON/CSV export.",
    href: "/tools/hfeq-mandarin/",
  },
  {
    id: "platform-reframe",
    date: "2026-05-06",
    type: "Group update",
    title: "Research group theme updated: AI-enabled hearing care and digital assessment",
    summary:
      "The website now presents iDIN, PROMs, and future tools as part of a broader AI-enabled hearing-care assessment platform.",
    href: "/tools/",
  },
  {
    id: "language-audio-expansion",
    date: "2026-05-05",
    type: "Tool",
    title: "New DIN language audio tracks and digit optimization workflows added",
    summary:
      "Taiwanese and American English audio tracks were added, with American English correction levels prepared for sequence synthesis.",
    href: "/tools/digit-in-noise-test/",
  },
  {
    id: "ai-audiologists-china",
    date: "2026-01-15",
    dateLabel: "2026",
    type: "Publication",
    title: "Perspectives of audiologists in China on artificial intelligence in clinical practice and professional identity",
    summary:
      "A qualitative study on how audiologists in China view AI in clinical practice, professional identity, and future hearing-care work.",
    href: "/publications/",
  },
  {
    id: "chatbot-timeliness-prompt",
    date: "2026-01-10",
    dateLabel: "2026",
    type: "Publication",
    title: "Evaluation of AI chatbots in hearing health: model timeliness and prompt design matter",
    summary:
      "A publication highlighting practical considerations for using AI chatbots in hearing-health information and support.",
    href: "/publications/",
  },
  {
    id: "monitor-hearing-era",
    date: "2026-02-01",
    dateLabel: "2026 Feb",
    type: "Publication",
    title: "Now Is the Era When Everyone Can Easily Measure and Monitor Hearing",
    summary:
      "A Hearing Journal article framing accessible hearing measurement and monitoring as a practical opportunity for hearing care.",
    href: "/publications/",
  },
];

export function sortNews(items: NewsItem[] = newsItems) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

export function getRecentNews(referenceDate = new Date(), months = RECENT_NEWS_MONTHS) {
  const cutoff = new Date(referenceDate);
  cutoff.setMonth(cutoff.getMonth() - months);
  return sortNews().filter((item) => new Date(`${item.date}T00:00:00`) >= cutoff);
}
