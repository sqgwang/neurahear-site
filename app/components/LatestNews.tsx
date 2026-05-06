import Link from "next/link";
import { getRecentNews, RECENT_NEWS_MONTHS } from "../data/news";

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

export default function LatestNews() {
  const recentNews = getRecentNews().slice(0, 4);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker">Latest news</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Recent activity from the platform.</h2>
          <p className="mt-3 max-w-2xl text-sm text-neutral-600">
            Home shows updates from roughly the last {RECENT_NEWS_MONTHS} months. The full archive is kept on the News page.
          </p>
        </div>
        <Link href="/news/" className="btn-secondary">
          News archive
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recentNews.map((item) => (
          <article key={item.id} className="card">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${typeClasses[item.type]}`}>
                {item.type}
              </span>
              <time className="text-xs font-semibold text-neutral-500" dateTime={item.date}>
                {item.dateLabel || formatDate(item.date)}
              </time>
            </div>
            <h3 className="mt-4 text-xl">{item.title}</h3>
            <p className="mt-3 text-sm text-neutral-600">{item.summary}</p>
            {item.href ? (
              <Link href={item.href} className="mt-4 inline-flex text-sm font-semibold text-brand-primary hover:text-neutral-950">
                Read more
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
