import Link from "next/link";
import type { ReactNode } from "react";
import { getRecentNews, type NewsItem, RECENT_NEWS_MONTHS } from "../data/news";

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

function NewsMeta({ item }: { item: NewsItem }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${typeClasses[item.type]}`}>
        {item.type}
      </span>
      <time className="text-xs font-semibold text-neutral-500" dateTime={item.date}>
        {item.dateLabel || formatDate(item.date)}
      </time>
    </div>
  );
}

export default function LatestNews() {
  const recentNews = getRecentNews();
  const recentPublications = recentNews.filter((item) => item.type === "Publication");
  const groupUpdates = recentNews.filter((item) => item.type !== "Publication").slice(0, 5);

  return (
    <section className="space-y-5" aria-labelledby="latest-news-heading">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker">Latest news</p>
          <h2 id="latest-news-heading" className="mt-3 text-3xl md:text-4xl">
            Recent activity from the platform.
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-neutral-600">
            Home keeps the most recent {RECENT_NEWS_MONTHS}-month window compact. The full archive is kept on the News page.
          </p>
        </div>
        <Link href="/news/" className="btn-secondary">
          News archive
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="surface overflow-hidden">
          <div className="border-b border-stone-200 px-4 py-3 md:px-5">
            <h3 className="text-base font-semibold text-neutral-950">Recent publications</h3>
          </div>
          <ol className="divide-y divide-stone-200">
            {recentPublications.map((item) => (
              <li key={item.id} className="px-4 py-3 md:px-5">
                <article className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                  <div className="min-w-0">
                    <NewsMeta item={item} />
                    <h4 className="mt-2 text-sm font-semibold leading-snug text-neutral-950">{item.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-600">{item.summary}</p>
                  </div>
                  {item.href ? (
                    <NewsLink href={item.href} className="text-xs font-semibold text-brand-primary hover:text-neutral-950">
                      Open
                    </NewsLink>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        </section>

        <aside className="surface overflow-hidden">
          <div className="border-b border-stone-200 px-4 py-3">
            <h3 className="text-base font-semibold text-neutral-950">Group updates</h3>
          </div>
          <ol className="divide-y divide-stone-200">
            {groupUpdates.map((item) => (
              <li key={item.id} className="px-4 py-3">
                <article>
                  <NewsMeta item={item} />
                  <h4 className="mt-2 text-sm font-semibold leading-snug text-neutral-950">{item.title}</h4>
                  {item.href ? (
                    <NewsLink href={item.href} className="mt-2 inline-flex text-xs font-semibold text-brand-primary hover:text-neutral-950">
                      Open
                    </NewsLink>
                  ) : null}
                </article>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}
