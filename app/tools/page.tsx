import Link from "next/link";
import { toolItems, toolStatusLegend, toolToneClasses } from "../data/tools";
import { createPageMetadata } from "../data/site";

export const metadata = createPageMetadata({
  title: "Assessment Tools",
  description:
    "Digital hearing assessment tools from HK Audiology Group, including iDIN, digit optimization, and HFEQ-Mandarin research workflows.",
  path: "/tools/",
});

function PlayIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export default function Tools() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
        <div className="max-w-3xl">
          <div className="eyebrow">Digital assessment platform</div>
          <h1>Assessment Tools</h1>
          <p className="mt-5 text-lg text-neutral-700">
            A growing platform for AI-enabled hearing care, speech-in-noise assessment, patient-reported outcomes, and study workflows.
          </p>
        </div>
        <div className="surface p-5">
          <p className="kicker">Platform principle</p>
          <p className="mt-3 text-sm text-neutral-700">
            Each tool should make its purpose, data handling, export format, and validation status visible before a researcher or participant begins.
          </p>
          <Link href="/tools/version-log/" className="btn-secondary mt-5">
            View version log
          </Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {toolStatusLegend.map((item) => (
          <div key={item.label} className="surface p-4">
            <div className="text-sm font-semibold text-neutral-950">{item.label}</div>
            <p className="mt-2 text-xs text-neutral-600">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5">
        {toolItems.map((tool) => (
          <article key={tool.title} className="card">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 max-w-4xl">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toolToneClasses[tool.tone]}`}>
                  {tool.status}
                </span>
                <p className="mt-4 text-xs font-semibold uppercase text-brand-primary">{tool.category}</p>
                <h2 className="mt-4 text-2xl">{tool.title}</h2>
                <p className="mt-3 text-sm text-neutral-600">{tool.description}</p>

                <dl className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                    <dt className="text-xs font-semibold uppercase text-neutral-500">Stage</dt>
                    <dd className="mt-2 text-sm text-neutral-800">{tool.stage}</dd>
                  </div>
                  <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                    <dt className="text-xs font-semibold uppercase text-neutral-500">Data handling</dt>
                    <dd className="mt-2 text-sm text-neutral-800">{tool.data}</dd>
                  </div>
                  <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                    <dt className="text-xs font-semibold uppercase text-neutral-500">Outputs</dt>
                    <dd className="mt-2 text-sm text-neutral-800">{tool.output}</dd>
                  </div>
                </dl>

                <p className="mt-4 text-xs font-semibold text-neutral-500">Version note: {tool.version}</p>
              </div>
              {tool.href ? (
                <a
                  className="btn shrink-0"
                  href={tool.href}
                  target={tool.href.startsWith("/tools/") ? "_blank" : undefined}
                  rel={tool.href.startsWith("/tools/") ? "noopener noreferrer" : undefined}
                >
                  <PlayIcon />
                  {tool.cta}
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2">
          <p className="kicker">Data safety</p>
          <h2 className="mt-3 text-2xl">Tool design should make research data boundaries obvious.</h2>
          <p className="mt-4 text-sm text-neutral-700">
            Browser-only tools are useful for pilots and demonstrations. Server-backed tools need deployment safeguards, backups, and explicit export routes.
            The platform now separates static site releases from DIN study data so interface updates do not overwrite live records.
          </p>
        </div>
        <div className="surface p-5">
          <p className="kicker">Restricted workflows</p>
          <p className="mt-3 text-sm text-neutral-700">
            Study-specific tools can remain URL-only until protocols, consent language, and review forms are finalized.
          </p>
          <Link href="/tools/version-log/" className="link mt-4 inline-flex text-sm font-semibold">
            See version notes
          </Link>
        </div>
      </section>

      <section className="surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="kicker">Study planning</p>
            <h2 className="mt-3 text-2xl">Need a research workflow instead of a public demo?</h2>
            <p className="mt-3 text-sm text-neutral-700">
              Contact the group before using server-backed tools in a study so language versioning, calibration, export format, and backup expectations are clear.
            </p>
          </div>
          <Link href="/contact/" className="btn shrink-0">
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
