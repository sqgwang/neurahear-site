import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Neural Hearing Lab", description: "Audiology · Speech in Noise" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <header className="container py-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-medium">HK Audiology Group</Link>
        <nav className="flex gap-5 text-sm">
          <Link href="/teams/" className="link">Team</Link>
          <Link href="/projects/" className="link">Projects</Link>
          <Link href="/publications/" className="link">Publications</Link>
          <Link href="/seminars/" className="link">Seminars</Link>
          <Link href="/tools/" className="link">Tools</Link>
        </nav>
      </header>
      <main className="container py-6">{children}</main>
      <footer className="container py-10 text-sm text-neutral-500">© 2025 HK Audiology Group · Hong Kong</footer>
    </body></html>
  );
}
