import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "HK Audiology Group",
  description: "Hearing science, clinical tools, and AI-enabled audiology research at The University of Hong Kong.",
  icons: {
    icon: [{ url: "/brand/neurahear-neural-ear-favicon.svg", type: "image/svg+xml" }],
    shortcut: "/brand/neurahear-neural-ear-favicon.svg",
    apple: "/brand/neurahear-neural-ear-mark.svg",
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
                <svg className="h-10 w-10 rounded-lg" viewBox="0 0 128 128" role="img">
                  <rect width="128" height="128" rx="28" fill="#171717" />
                  <path d="M47 95c-22-21-22-62 9-79 32-18 67 20 44 53-8 11-22 15-35 9" fill="none" stroke="#14b8a6" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M60 38c12 2 19 14 14 26-4 8-11 11-20 9" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.92" />
                  <path d="M42 36l38 4M80 40L69 80M42 36l27 44" fill="none" stroke="#a7f3d0" strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
                  <circle cx="42" cy="36" r="6.5" fill="#d97706" />
                  <circle cx="80" cy="40" r="6.5" fill="#38bdf8" />
                  <circle cx="69" cy="80" r="6.5" fill="#f8fafc" />
                  <path d="M27 91c20-11 40-11 60 0" fill="none" stroke="#14b8a6" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
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
