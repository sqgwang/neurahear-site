import "./globals.css";
import Link from "next/link";

export const metadata = { title: "HK Audiology Group", description: "Advancing Hearing Science · Innovative Research · Clinical Excellence" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-brand-dark hover:text-brand-primary transition-colors flex items-center gap-3 group">
              <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M3 12H6L9 5L15 19L18 12H21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="5" r="2" className="text-brand-gold fill-current" stroke="none"/>
                  <circle cx="15" cy="19" r="2" className="text-brand-primary fill-current" stroke="none"/>
                </svg>
              </div>
              HK Audiology Group
            </Link>
            <nav className="flex gap-6 text-base">
              <Link href="/teams/" className="nav-link">Team</Link>
              <Link href="/projects/" className="nav-link">Projects</Link>
              <Link href="/publications/" className="nav-link">Publications</Link>
              <Link href="/seminars/" className="nav-link">Seminars</Link>
              <Link href="/tools/" className="nav-link">Tools</Link>
            </nav>
          </div>
        </header>
        <main className="container py-12 animate-fade-in">{children}</main>
        <footer className="bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 mt-20">
          <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">© 2025 HK Audiology Group · The University of Hong Kong</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <a href="#" className="hover:text-blue-700 transition-colors">Privacy</a>
                <a href="#" className="hover:text-blue-700 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
