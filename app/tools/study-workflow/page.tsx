import Link from "next/link";
import { createPageMetadata } from "../../data/site";
import { dataCollectionModes, studyReleaseChecklist, workflowBoundaries, workflowPhases } from "../../data/studyWorkflow";

export const metadata = createPageMetadata({
  title: "Study Workflow Guide",
  description:
    "Research workflow guide for using NeuraHear digital hearing assessment tools, including study modes, calibration, data capture, export, and safeguards.",
  path: "/tools/study-workflow/",
});

export default function StudyWorkflowPage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
        <div className="max-w-3xl">
          <div className="eyebrow">Research operations</div>
          <h1>Study Workflow Guide</h1>
          <p className="mt-5 text-lg text-neutral-700">
            A practical guide for deciding how a NeuraHear assessment tool should be configured, calibrated, collected, exported, and protected in a study.
          </p>
        </div>
        <div className="surface p-5">
          <p className="kicker">Use this before recruitment</p>
          <p className="mt-3 text-sm text-neutral-700">
            The goal is to make versioning, data mode, calibration, and export assumptions explicit before participant data collection starts.
          </p>
          <Link href="/tools/version-log/" className="btn-secondary mt-5">
            Check version log
          </Link>
        </div>
      </section>

      <section className="surface overflow-hidden">
        <div className="border-b border-stone-200 px-6 py-5">
          <p className="kicker">Workflow</p>
          <h2 className="mt-3 text-2xl">From setup to export</h2>
        </div>
        <div className="divide-y divide-stone-200">
          {workflowPhases.map((phase) => (
            <article key={phase.step} className="grid gap-5 p-6 lg:grid-cols-[120px_minmax(0,1fr)_minmax(260px,0.4fr)]">
              <div>
                <div className="text-3xl font-semibold text-neutral-950">{phase.step}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">{phase.label}</div>
              </div>
              <div>
                <h3 className="text-xl">{phase.title}</h3>
                <p className="mt-3 text-sm text-neutral-600">{phase.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {phase.checks.map((check) => (
                    <span key={check} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                      {check}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs font-semibold uppercase text-neutral-500">Expected output</p>
                <p className="mt-2 text-sm font-semibold text-neutral-800">{phase.output}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {dataCollectionModes.map((mode) => (
          <article key={mode.label} className="card">
            <p className="kicker">{mode.label}</p>
            <h2 className="mt-3 text-2xl">Best for</h2>
            <p className="mt-3 text-sm text-neutral-600">{mode.bestFor}</p>
            <div className="mt-5 rounded-md border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-semibold uppercase text-neutral-500">Data handling</p>
              <p className="mt-2 text-sm text-neutral-800">{mode.data}</p>
            </div>
            <ul className="mt-5 space-y-2 p-0">
              {mode.safeguards.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-neutral-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="surface p-6">
          <p className="kicker">Release checklist</p>
          <h2 className="mt-3 text-2xl">Before a study-facing update goes live</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {studyReleaseChecklist.map((item) => (
              <div key={item} className="rounded-md border border-stone-200 bg-stone-50 p-3 text-sm font-medium text-neutral-800">
                {item}
              </div>
            ))}
          </div>
        </div>
        <aside className="surface p-6">
          <p className="kicker">Boundaries</p>
          <div className="mt-5 space-y-5">
            {workflowBoundaries.map((boundary) => (
              <div key={boundary.label}>
                <h3 className="text-lg">{boundary.label}</h3>
                <p className="mt-2 text-sm text-neutral-600">{boundary.text}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-stone-200 bg-neutral-950 p-6 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">Ready to configure a study?</p>
          <h2 className="mt-3 text-2xl text-white">Start with the tool baseline, then confirm the data mode.</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/tools/" className="btn bg-white text-neutral-950 hover:bg-stone-100">
            View tools
          </Link>
          <Link href="/contact/" className="btn-secondary border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
