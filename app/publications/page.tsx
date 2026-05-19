import {
  PUBLICATIONS_LAST_UPDATED,
  getProfilePublicationCounts,
  getPublicationSignalStats,
  getPublicationStats,
  getPublicationYears,
  getRecentPublications,
  publications,
  scholarProfiles,
  type ProfileKey,
} from "../data/publications";
import { createPageMetadata } from "../data/site";

export const metadata = createPageMetadata({
  title: "Publications",
  description:
    "Scholar-indexed publications from HK Audiology Group across AI-enabled hearing care, digital assessment, speech-in-noise testing, and hearing-care systems.",
  path: "/publications/",
});

const profileStyles: Record<ProfileKey, string> = {
  Shang: "border-teal-200 bg-teal-50 text-teal-800",
  Dicky: "border-amber-200 bg-amber-50 text-amber-800",
};

function AuthorText({ authors }: { authors: string }) {
  const parts = authors.split(/(\bS Wang\b|\bW Shangqiguo\b|\bC Mo\b)/g);

  return (
    <>
      {parts.map((part, index) =>
        /\b(S Wang|W Shangqiguo|C Mo)\b/.test(part) ? (
          <strong key={`${part}-${index}`} className="font-semibold text-neutral-950">
            {part}
          </strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

export default function Publications() {
  const years = getPublicationYears();
  const stats = getPublicationStats();
  const recentPublications = getRecentPublications(6);
  const signalStats = getPublicationSignalStats();
  const profileCounts = getProfilePublicationCounts();

  return (
    <div className="space-y-12">
      <section className="max-w-4xl">
        <div className="eyebrow">Updated from Google Scholar / {PUBLICATIONS_LAST_UPDATED}</div>
        <h1>Publications</h1>
        <p className="mt-5 max-w-3xl text-lg text-neutral-700">
          A refreshed publication record combining Scholar-indexed work from Shangqiguo Wang and Changgeng Mo.
          Citation counts are shown as they appeared on the linked profiles at update time.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="surface p-5">
          <div className="text-3xl font-semibold text-neutral-950">{stats.total}</div>
          <div className="mt-1 text-sm text-neutral-500">Unique publication entries</div>
        </div>
        <div className="surface p-5">
          <div className="text-3xl font-semibold text-neutral-950">{stats.recentCount}</div>
          <div className="mt-1 text-sm text-neutral-500">Entries from 2025 onward</div>
        </div>
        <div className="surface p-5">
          <div className="text-3xl font-semibold text-neutral-950">{stats.citationTotal}</div>
          <div className="mt-1 text-sm text-neutral-500">Citations across listed entries</div>
        </div>
        <div className="surface p-5">
          <div className="text-3xl font-semibold text-neutral-950">{profileCounts.length}</div>
          <div className="mt-1 text-sm text-neutral-500">Scholar profiles tracked</div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="surface overflow-hidden">
          <div className="border-b border-stone-200 px-5 py-4">
            <p className="kicker">Recent outputs</p>
            <h2 className="mt-3 text-2xl">Latest listed publications</h2>
          </div>
          <ol className="divide-y divide-stone-200">
            {recentPublications.map((publication) => (
              <li key={`recent-${publication.year}-${publication.title}`} className="px-5 py-4">
                <article>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                      {publication.year}
                    </span>
                    {publication.profiles.map((profileKey) => (
                      <span key={profileKey} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${profileStyles[profileKey]}`}>
                        {profileKey}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base leading-snug">
                    {publication.url ? (
                      <a href={publication.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-primary">
                        {publication.title}
                      </a>
                    ) : (
                      publication.title
                    )}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600">
                    <AuthorText authors={publication.authors} />
                  </p>
                  <p className="mt-1 text-sm font-medium text-neutral-500">{publication.venue}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>

        <aside className="surface p-5">
          <p className="kicker">Research signals</p>
          <h2 className="mt-3 text-2xl">What the record is starting to say.</h2>
          <div className="mt-5 space-y-4">
            {signalStats.map((signal) => (
              <div key={signal.key} className="rounded-md border border-stone-200 bg-stone-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">{signal.label}</div>
                    <p className="mt-2 text-xs text-neutral-600">{signal.description}</p>
                  </div>
                  <span className="shrink-0 text-2xl font-semibold text-neutral-950">{signal.count}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-neutral-500">
            Signal counts are keyword-assisted summaries for navigation, not formal bibliometric categories.
          </p>
        </aside>
      </section>

      <section className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          {scholarProfiles.map((profile) => (
            <a
              key={profile.key}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="surface block p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_16px_40px_rgba(23,23,23,0.08)]"
            >
              <div className={`mb-4 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${profileStyles[profile.key]}`}>
                Google Scholar
              </div>
              <h2 className="text-xl">{profile.name}</h2>
              <p className="mt-2 text-sm text-neutral-500">{profile.role}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-semibold text-neutral-950">{profile.citations}</div>
                  <div className="text-neutral-500">Cited by</div>
                </div>
                <div>
                  <div className="font-semibold text-neutral-950">{profile.listed}</div>
                  <div className="text-neutral-500">Profile items</div>
                </div>
              </div>
            </a>
          ))}
        </aside>

        <div className="space-y-10">
          {years.map((year) => {
            const entries = publications.filter((publication) => publication.year === year);

            return (
              <section key={year} className="space-y-4">
                <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-3">
                  <h2 className="text-3xl">{year}</h2>
                  <p className="text-sm text-neutral-500">{entries.length} entries</p>
                </div>

                <ol className="space-y-3">
                  {entries.map((publication) => (
                    <li key={`${publication.year}-${publication.title}`} className="surface p-5 transition-all duration-300 hover:border-stone-300 hover:bg-white">
                      <article>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          {publication.profiles.map((profileKey) => (
                            <span key={profileKey} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${profileStyles[profileKey]}`}>
                              {profileKey === "Shang" ? "Shang" : "Dicky"}
                            </span>
                          ))}
                          {publication.citations > 0 ? (
                            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                              {publication.citations} citations
                            </span>
                          ) : (
                            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-500">
                              New / no citations yet
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg leading-snug">
                          {publication.url ? (
                            <a href={publication.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-primary">
                              {publication.title}
                            </a>
                          ) : (
                            publication.title
                          )}
                        </h3>
                        <p className="mt-3 text-sm text-neutral-600">
                          <AuthorText authors={publication.authors} />
                        </p>
                        <p className="mt-2 text-sm font-medium text-neutral-500">{publication.venue}</p>
                      </article>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
