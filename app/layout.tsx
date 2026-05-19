import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "HK Audiology Group",
  description: "Hearing science, clinical tools, and AI-enabled audiology research at The University of Hong Kong.",
  icons: {
    icon: [{ url: "/brand/nh-mark.svg", type: "image/svg+xml" }],
    shortcut: "/brand/nh-mark.svg",
    apple: "/brand/nh-mark.svg",
  },
};

const navItems = [
  { href: "/teams/", label: "Team" },
  { href: "/projects/", label: "Projects" },
  { href: "/publications/", label: "Publications" },
  { href: "/news/", label: "News" },
  { href: "/seminars/", label: "Seminars" },
  { href: "/tools/", label: "Tools" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-stone-200 bg-[rgba(246,247,243,0.88)] backdrop-blur-xl">
          <div className="container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="group flex items-center gap-3 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 shadow-[0_10px_24px_rgba(23,23,23,0.18)] transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true">
                <svg className="h-10 w-10 rounded-lg" viewBox="0 0 64 64" role="img">
                  <rect width="64" height="64" rx="14" fill="#171717" />
                  <circle cx="50" cy="16" r="5" fill="#14b8a6" />
                  <path d="M12 47c7-4.8 14-4.8 21 0s14 4.8 21 0" fill="none" stroke="#14b8a6" strokeWidth="3.5" strokeLinecap="round" opacity="0.86" />
                  <path d="M15 20h4.6v24H15zM21.9 20h4.9L35 44h-4.9zM31.6 20h4.6v24h-4.6zM41 20h4.6v24H41zM51 20h4.6v24H51zM41 31.1h14.6v4.6H41z" fill="#fff" />
                </svg>
              </div>
              <div>
                <div className="text-base font-semibold leading-tight text-neutral-950">HK Audiology Group</div>
                <div className="hidden text-xs font-medium uppercase tracking-[0.18em] text-neutral-500 sm:block">Hearing science lab</div>
              </div>
            </Link>
            <nav className="flex flex-wrap items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="container py-10 md:py-14 animate-fade-in">{children}</main>
        <footer className="mt-20 border-t border-stone-200 bg-white/75">
          <div className="container py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-neutral-500">© 2026 HK Audiology Group / The University of Hong Kong</p>
              <div className="flex gap-4 text-sm text-neutral-500">
                <Link href="/publications/" className="hover:text-neutral-950 transition-colors">Publications</Link>
                <Link href="/news/" className="hover:text-neutral-950 transition-colors">News</Link>
                <Link href="/tools/" className="hover:text-neutral-950 transition-colors">Assessment tools</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
