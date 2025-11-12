import "./globals.css";
import Link from "next/link";

export const metadata = { title: "HK Audiology Group", description: "Advancing Hearing Science · Innovative Research · Clinical Excellence" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
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
