const tools = [
  {
    title: "integrated Digit-in-Noise Test",
    category: "Speech-in-noise assessment",
    description:
      "A browser-based screening workflow with calibration, device checks, adaptive SNR testing, and server-backed data capture.",
    status: "Live",
    stage: "Operational research tool",
    href: "/tools/digit-in-noise-test/",
    cta: "Launch test",
    tone: "teal",
    data: "Responses are submitted to the project backend for study use.",
    output: "Participant-level DIN records and server-side study exports.",
    version: "Active deployment",
  },
  {
    title: "Digit Optimization Test",
    category: "Stimulus optimization",
    description: "A fixed-SNR single-digit workflow for estimating PI functions and generating correction levels for sequence synthesis.",
    status: "Live",
    stage: "Stimulus development workflow",
    href: "/tools/single-digit-in-noise-test/",
    cta: "Launch optimization",
    tone: "amber",
    data: "Runs in the browser; individual and pooled results are exported by the researcher.",
    output: "Raw CSV, full JSON, PI summaries, and digit correction arrays.",
    version: "Noise calibration enabled",
  },
  {
    title: "HFEQ-Mandarin Research Preview",
    category: "Everyday functioning PROM",
    description:
      "An ICF-based questionnaire workflow for Mandarin-speaking adults, covering hearing, communication, participation, support, personal resources, and health.",
    status: "In validation",
    stage: "PROM research preview",
    href: "/tools/hfeq-mandarin/",
    cta: "Open preview",
    tone: "sky",
    data: "Browser-only completion and export for research preview use.",
    output: "Domain scores, item responses, JSON, and CSV.",
    version: "Manuscript-linked preview",
  },
  {
    title: "AI-Guided Hearing-Care Workflows",
    category: "AI in hearing care",
    description:
      "Planned tools for AI-supported questionnaire guidance, triage, interpretation, and care-pathway support, developed with human oversight.",
    status: "In development",
    stage: "Design and validation planning",
    href: "/projects/ai-hearing-care/",
    cta: "View research theme",
    tone: "neutral",
    data: "No public tool yet; future tools will separate research data, generated outputs, and review records.",
    output: "Planned: evaluation packages, clinician review exports, and patient-facing explanations.",
    version: "Concept stage",
  },
];

const toneClasses = {
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  sky: "border-sky-200 bg-sky-50 text-sky-800",
  neutral: "border-stone-200 bg-stone-50 text-neutral-600",
};

const statusLegend = [
  { label: "Live", text: "Available for current research workflows." },
  { label: "In validation", text: "Usable as a preview while measurement work continues." },
  { label: "In development", text: "Research direction is active, public workflow is still being designed." },
  { label: "Restricted", text: "URL-only study workflow, not listed until protocols are finalized." },
];

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
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {statusLegend.map((item) => (
          <div key={item.label} className="surface p-4">
            <div className="text-sm font-semibold text-neutral-950">{item.label}</div>
            <p className="mt-2 text-xs text-neutral-600">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5">
        {tools.map((tool) => (
          <article key={tool.title} className="card">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 max-w-4xl">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[tool.tone as keyof typeof toneClasses]}`}>
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
        </div>
      </section>
    </div>
  );
}
