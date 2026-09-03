import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./data/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.organizationName, url: siteConfig.url }],
  creator: siteConfig.organizationName,
  publisher: "The University of Hong Kong",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "en_HK",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.image,
        width: 1200,
        height: 630,
        alt: "NeuraHear by HK Audiology Group: AI-enabled hearing care and digital assessment tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.image],
  },
  icons: {
    icon: [{ url: "/brand/neurahear-favicon.svg", type: "image/svg+xml" }],
    shortcut: "/brand/neurahear-favicon.svg",
    apple: "/brand/neurahear-favicon.svg",
  },
};

const navItems = [
  { href: "/teams/", label: "Team" },
  { href: "/projects/", label: "Projects" },
  { href: "/publications/", label: "Publications" },
  { href: "/news/", label: "News" },
  { href: "/tools/", label: "Tools" },
  { href: "/contact/", label: "Contact" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    name: siteConfig.organizationName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    logo: absoluteUrl("/brand/neurahear-logo.svg"),
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: siteConfig.institution,
      url: "https://www.hku.hk/",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Research enquiries",
      email: siteConfig.email,
      availableLanguage: ["English", "Chinese"],
    },
    sameAs: [
      absoluteUrl("/publications/"),
      absoluteUrl("/tools/"),
      absoluteUrl("/contact/"),
    ],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <header className="sticky top-0 z-50 border-b border-stone-200 bg-[rgba(246,247,243,0.92)] backdrop-blur-xl">
          <div className="container flex min-h-16 items-center justify-between gap-6 py-2">
            <Link href="/" className="group flex min-w-0 items-center gap-3 no-underline" aria-label="NeuraHear home">
              <Image
                src="/brand/neurahear-mark.svg"
                alt=""
                width="42"
                height="42"
                className="h-10 w-10 shrink-0 transition-opacity duration-200 group-hover:opacity-70"
              />
              <div>
                <div className="text-lg font-semibold leading-tight text-neutral-950">NeuraHear</div>
                <div className="hidden text-xs font-medium text-neutral-500 sm:block">by HK Audiology Group</div>
              </div>
            </Link>
            <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
            <details className="relative lg:hidden">
              <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md border border-stone-300 bg-white text-neutral-950 transition-colors hover:border-stone-400 [&::-webkit-details-marker]:hidden">
                <span className="sr-only">Open navigation</span>
                <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </summary>
              <nav aria-label="Mobile navigation" className="absolute right-0 top-14 grid w-60 gap-1 rounded-lg border border-stone-200 bg-white p-2 shadow-[0_18px_50px_rgba(23,23,23,0.14)]">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-md px-4 py-3 text-base font-medium text-neutral-700 no-underline transition-colors hover:bg-stone-100 hover:text-neutral-950">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </header>
        <main className="container py-10 md:py-14 animate-fade-in">{children}</main>
        <footer className="mt-20 border-t border-stone-200 bg-white/75">
          <div className="container py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-neutral-500">© 2026 NeuraHear by HK Audiology Group / The University of Hong Kong</p>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                <Link href="/publications/" className="hover:text-neutral-950 transition-colors">Publications</Link>
                <Link href="/news/" className="hover:text-neutral-950 transition-colors">News</Link>
                <Link href="/seminars/" className="hover:text-neutral-950 transition-colors">Seminars</Link>
                <Link href="/tools/" className="hover:text-neutral-950 transition-colors">Assessment tools</Link>
                <Link href="/contact/" className="hover:text-neutral-950 transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
