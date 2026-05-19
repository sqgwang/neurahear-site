import { NewsLink, NewsMeta } from "../components/NewsUi";
import { sortNews } from "../data/news";

export const metadata = {
  title: "News | HK Audiology Group",
  description: "News, publications, tools, conferences, and seminar updates from HK Audiology Group.",
};

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
                <NewsMeta item={item} />
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
