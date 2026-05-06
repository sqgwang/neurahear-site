import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "HK Audiology Group",
  description: "Hearing science, clinical tools, and AI-enabled audiology research at The University of Hong Kong.",
};

const navItems = [
  { href: "/teams/", label: "Team" },
  { href: "/projects/", label: "Projects" },
  { href: "/publications/", label: "Publications" },
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 text-sm font-bold text-white shadow-[0_10px_24px_rgba(23,23,23,0.18)] transition-transform duration-300 group-hover:-translate-y-0.5">
                NH
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
                <Link href="/tools/" className="hover:text-neutral-950 transition-colors">Research tools</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
