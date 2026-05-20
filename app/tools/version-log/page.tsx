import Link from "next/link";
import {
  toolItems,
  toolReleaseNotes,
  toolToneClasses,
  versionLogPrinciples,
  type ReleaseStatus,
} from "../../data/tools";
import { createPageMetadata } from "../../data/site";

export const metadata = createPageMetadata({
  title: "Tool Version Log",
  description:
    "Version log and current baseline for NeuraHear digital hearing assessment tools, including iDIN, Digit Optimization, and HFEQ-Mandarin.",
  path: "/tools/version-log/",
});

const releaseStatusClasses: Record<ReleaseStatus, string> = {
  Released: "border-teal-200 bg-teal-50 text-teal-800",
  Baseline: "border-amber-200 bg-amber-50 text-amber-800",
  Planned: "border-stone-200 bg-stone-50 text-neutral-600",
};

export default function ToolVersionLogPage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
        <div className="max-w-3xl">
          <div className="eyebrow">Tool governance</div>
          <h1>Tool Version Log</h1>
          <p className="mt-5 text-lg text-neutral-700">
            A public baseline for NeuraHear assessment tools, release notes, data-boundary statements, and future study-facing changes.
          </p>
        </div>
        <div className="surface p-5">
          <p className="kicker">Why this matters</p>
          <p className="mt-3 text-sm text-neutral-700">
            Research tools change over time. Version notes help future users know which calibration, stimuli, scoring, export, and data-handling assumptions applied.
          </p>
          <Link href="/tools/" className="btn-secondary mt-5">
            Back to tools
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {versionLogPrinciples.map((principle) => (
          <article key={principle.label} className="surface p-5">
            <p className="kicker">{principle.label}</p>
            <p className="mt-3 text-sm text-neutral-700">{principle.text}</p>
          </article>
        ))}
      </section>

      <section className="surface overflow-hidden">
        <div className="border-b border-stone-200 px-6 py-5">
          <p className="kicker">Current baseline</p>
          <h2 className="mt-3 text-2xl">Public assessment-tool register</h2>
        </div>
        <div className="divide-y divide-stone-200">
          {toolItems.map((tool) => (
            <article key={tool.title} className="grid gap-5 p-6 lg:grid-cols-[minmax(0,0.75fr)_minmax(280px,0.45fr)]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${toolToneClasses[tool.tone]}`}>
                    {tool.status}
                  </span>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                    {tool.category}
                  </span>
                </div>
                <h3 className="mt-4 text-xl">{tool.title}</h3>
                <p className="mt-3 text-sm text-neutral-600">{tool.description}</p>
              </div>
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                  <dt className="text-xs font-semibold uppercase text-neutral-500">Version note</dt>
                  <dd className="mt-2 text-sm text-neutral-800">{tool.version}</dd>
                </div>
                <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
                  <dt className="text-xs font-semibold uppercase text-neutral-500">Data boundary</dt>
                  <dd className="mt-2 text-sm text-neutral-800">{tool.data}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5">
        <div>
          <p className="kicker">Release notes</p>
          <h2 className="mt-3 text-2xl">Recent platform and tool-facing changes</h2>
        </div>

        {toolReleaseNotes.map((note) => (
          <article key={`${note.date}-${note.title}`} className="card">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${releaseStatusClasses[note.status]}`}>
                    {note.status}
                  </span>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                    {note.date}
                  </span>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${toolToneClasses[note.tone]}`}>
                    {note.tool}
                  </span>
                </div>
                <h3 className="mt-4 text-xl">{note.title}</h3>
                <p className="mt-2 text-sm font-semibold text-neutral-500">{note.version}</p>
                <p className="mt-3 text-sm text-neutral-600">{note.summary}</p>
                <ul className="mt-4 space-y-2 p-0">
                  {note.changes.map((change) => (
                    <li key={change} className="flex gap-3 text-sm text-neutral-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" aria-hidden="true" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3 text-xs font-medium text-neutral-600">
                  Data boundary: {note.dataBoundary}
                </p>
              </div>
              {note.href ? (
                <a className="btn-secondary shrink-0" href={note.href}>
                  View related page
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <section className="surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="kicker">Before a study release</p>
            <h2 className="mt-3 text-2xl">Log behavior changes before new data collection starts.</h2>
            <p className="mt-3 text-sm text-neutral-700">
              Calibration flow, audio stimuli, scoring, export fields, server routes, and backup assumptions should be recorded here before a protocol uses a new version.
            </p>
          </div>
          <Link href="/tools/study-workflow/" className="btn shrink-0">
            Study workflow
          </Link>
        </div>
      </section>
    </div>
  );
}
