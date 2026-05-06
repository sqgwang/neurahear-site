import Link from "next/link";
import type { ReactNode } from "react";
import { sortNews } from "../data/news";

export const metadata = {
  title: "News | HK Audiology Group",
  description: "News, publications, tools, conferences, and seminar updates from HK Audiology Group.",
};

const typeClasses = {
  Publication: "border-sky-200 bg-sky-50 text-sky-800",
  Tool: "border-teal-200 bg-teal-50 text-teal-800",
  Conference: "border-amber-200 bg-amber-50 text-amber-800",
  Seminar: "border-rose-200 bg-rose-50 text-rose-800",
  "Group update": "border-stone-200 bg-stone-50 text-neutral-700",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function NewsLink({ href, children, className }: { href: string; children: ReactNode; className: string }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function NewsPage() {
  const items = sortNews();

  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <div className="eyebrow">Permanent archive</div>
        <h1>News</h1>
        <p className="mt-5 text-lg text-neutral-700">
          A running archive of group updates, assessment-tool releases, publications, conferences, and seminar activity.
        </p>
      </section>

      <section className="space-y-4">
        {items.map((item) => (
          <article key={item.id} className="surface p-5 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${typeClasses[item.type]}`}>
                    {item.type}
                  </span>
                  <time className="text-xs font-semibold text-neutral-500" dateTime={item.date}>
                    {item.dateLabel || formatDate(item.date)}
                  </time>
                </div>
                <h2 className="mt-4 text-2xl">{item.title}</h2>
                <p className="mt-3 text-sm text-neutral-600">{item.summary}</p>
              </div>
              {item.href ? (
                <NewsLink href={item.href} className="btn-secondary shrink-0">
                  Open
                </NewsLink>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
