import { NewsLink, NewsMeta } from "../components/NewsUi";
import { RECENT_NEWS_MONTHS, getNewsTypeCounts, groupNewsByYear, newsItems } from "../data/news";
import { createPageMetadata } from "../data/site";

export const metadata = createPageMetadata({
  title: "News | HK Audiology Group",
  description: "News, publications, tools, conferences, and seminar updates from HK Audiology Group.",
  path: "/news/",
});

export default function NewsPage() {
  const yearGroups = groupNewsByYear();
  const typeCounts = getNewsTypeCounts();
  const typeEntries = Object.entries(typeCounts).filter(([, count]) => count > 0);

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.48fr)] lg:items-end">
        <div className="max-w-4xl">
          <div className="eyebrow">Permanent archive</div>
          <h1>News</h1>
          <p className="mt-5 text-lg text-neutral-700">
            A running archive of group updates, assessment-tool releases, publications, conferences, and seminar activity.
            The homepage stays compact by showing only the latest {RECENT_NEWS_MONTHS}-month window.
          </p>
        </div>

        <div className="surface p-5">
          <p className="kicker">Archive status</p>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-3xl font-semibold text-neutral-950">{newsItems.length}</dt>
              <dd className="mt-1 text-xs text-neutral-500">Total updates</dd>
            </div>
            <div>
              <dt className="text-3xl font-semibold text-neutral-950">{yearGroups.length}</dt>
              <dd className="mt-1 text-xs text-neutral-500">Archive years</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-5">
        {typeEntries.map(([type, count]) => (
          <div key={type} className="surface p-4">
            <div className="text-2xl font-semibold text-neutral-950">{count}</div>
            <div className="mt-1 text-xs font-semibold text-neutral-500">{type}</div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        {yearGroups.map(({ year, entries }) => (
          <div key={year} className="space-y-3">
            <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-3">
              <h2 className="text-3xl">{year}</h2>
              <p className="text-sm text-neutral-500">{entries.length} updates</p>
            </div>

            <ol className="space-y-3">
              {entries.map((item) => (
                <li key={item.id} className="surface p-5 md:p-6">
                  <article className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div className="min-w-0 max-w-3xl">
                      <NewsMeta item={item} />
                      <h3 className="mt-4 text-xl md:text-2xl">{item.title}</h3>
                      <p className="mt-3 text-sm text-neutral-600">{item.summary}</p>
                    </div>
                    {item.href ? (
                      <NewsLink href={item.href} className="btn-secondary shrink-0">
                        Open
                      </NewsLink>
                    ) : null}
                  </article>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      <section className="surface p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-[0.7fr_1.3fr] md:items-center">
          <div>
            <p className="kicker">Maintenance pattern</p>
            <h2 className="mt-3 text-2xl">Add once, render everywhere.</h2>
          </div>
          <p className="text-sm text-neutral-700">
            New conference notes, publication announcements, tool releases, and group updates should be added to <span className="font-semibold text-neutral-950">app/data/news.ts</span>.
            The archive, homepage latest-news window, and type summaries will update from the same source.
          </p>
        </div>
      </section>
    </div>
  );
}
