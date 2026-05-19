import type { Metadata } from "next";

export const siteUrl = "https://neurahear.com";

export const siteConfig = {
  name: "HK Audiology Group",
  shortName: "NeuraHear",
  url: siteUrl,
  email: "sqgw@connect.hku.hk",
  institution: "The University of Hong Kong",
  title: "HK Audiology Group | AI-Enabled Hearing Care",
  description:
    "AI-enabled hearing-care research and digital hearing assessment tools from HK Audiology Group at The University of Hong Kong.",
  image: "/brand/neurahear-social-card.svg",
  keywords: [
    "AI-enabled hearing care",
    "digital hearing assessment",
    "audiology",
    "speech-in-noise",
    "digit-in-noise test",
    "iDIN",
    "hearing science",
    "The University of Hong Kong",
  ],
};

export const primarySiteRoutes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/news/", priority: 0.8, changeFrequency: "weekly" },
  { path: "/publications/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projects/", priority: 0.7, changeFrequency: "monthly" },
  { path: "/projects/ai-hearing-care/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projects/hearing-healthcare-china/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/teams/", priority: 0.7, changeFrequency: "monthly" },
  { path: "/teams/shang-wang/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/teams/dicky-mo/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact/", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/tools/hfeq-mandarin/", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/digit-in-noise-test/", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/single-digit-in-noise-test/", priority: 0.6, changeFrequency: "monthly" },
  { path: "/seminars/", priority: 0.5, changeFrequency: "monthly" },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.image,
          width: 1200,
          height: 630,
          alt: "HK Audiology Group: AI-enabled hearing care and digital assessment tools",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.image],
    },
  };
}
