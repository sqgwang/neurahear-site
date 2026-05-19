import Link from "next/link";
import { contactChannels, collaborationTopics, credibilityNotes, emailChecklist } from "../data/contact";
import { createPageMetadata, siteConfig } from "../data/site";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact HK Audiology Group for AI-enabled hearing care, digital hearing assessment tools, iDIN, PROMs, and research collaboration.",
  path: "/contact/",
});

function ExternalIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17 17 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
        <div className="max-w-3xl">
          <div className="eyebrow">Contact and research identity</div>
          <h1>Contact HK Audiology Group</h1>
          <p className="mt-5 text-lg text-neutral-700">
            We build and validate AI-enabled hearing-care workflows, digital hearing assessment tools, and research-facing measurement platforms.
          </p>
        </div>
        <div className="surface p-5">
          <p className="kicker">Best starting point</p>
          <h2 className="mt-3 text-2xl">Research enquiries</h2>
          <p className="mt-3 text-sm text-neutral-700">
            For collaboration, tool access, or study deployment questions, email the research contact with the project context and the tool you want to use.
          </p>
          <a className="btn mt-5 w-full sm:w-auto" href={`mailto:${siteConfig.email}`}>
            Email the group
          </a>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {contactChannels.map((channel) => {
          const isInternal = channel.href.startsWith("/");
          const isEmail = channel.href.startsWith("mailto:");
          const isExternal = channel.href.startsWith("http");

          return (
            <article key={channel.label} className="card">
              <p className="kicker">{channel.label}</p>
              <h2 className="mt-3 text-2xl">{channel.value}</h2>
              <p className="mt-3 text-sm text-neutral-600">{channel.text}</p>
              {isInternal ? (
                <Link href={channel.href} className="btn-secondary mt-5">
                  Open page
                </Link>
              ) : (
                <a href={channel.href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className="btn-secondary mt-5">
                  {isEmail ? "Email us" : "Open link"}
                  {isExternal ? <ExternalIcon /> : null}
                </a>
              )}
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="surface p-6">
          <p className="kicker">Collaboration scope</p>
          <h2 className="mt-3 text-2xl">What to contact us about</h2>
          <ul className="mt-5 grid gap-3 p-0 sm:grid-cols-2">
            {collaborationTopics.map((topic) => (
              <li key={topic} className="list-none rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-neutral-800">
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <aside className="surface p-6">
          <p className="kicker">Helpful details</p>
          <h2 className="mt-3 text-2xl">Include in your email</h2>
          <ol className="mt-5 space-y-3 p-0">
            {emailChecklist.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm text-neutral-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-neutral-950 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="surface overflow-hidden">
        <div className="border-b border-stone-200 px-6 py-5">
          <p className="kicker">Credibility layer</p>
          <h2 className="mt-3 text-2xl">How visitors can evaluate the platform</h2>
        </div>
        <div className="grid gap-0 divide-y divide-stone-200 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {credibilityNotes.map((note) => (
            <article key={note.label} className="p-6">
              <h3 className="text-lg">{note.label}</h3>
              <p className="mt-3 text-sm text-neutral-600">{note.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-stone-200 bg-neutral-950 p-6 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">Research context</p>
          <h2 className="mt-3 text-2xl text-white">Check the team and publication record before starting.</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/teams/" className="btn bg-white text-neutral-950 hover:bg-stone-100">
            View team
          </Link>
          <Link href="/publications/" className="btn-secondary border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
            View publications
          </Link>
        </div>
      </section>
    </div>
  );
}
