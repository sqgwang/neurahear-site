const tools = [
  {
    title: "integrated Digit-in-Noise Test",
    category: "Speech-in-noise assessment",
    description:
      "A browser-based screening workflow with calibration, device checks, adaptive SNR testing, and server-backed data capture.",
    status: "Live",
    href: "/tools/digit-in-noise-test/",
    cta: "Launch test",
    tone: "teal",
  },
  {
    title: "Digit Optimization Test",
    category: "Stimulus optimization",
    description: "A fixed-SNR single-digit workflow for estimating PI functions and generating correction levels for sequence synthesis.",
    status: "Live",
    href: "/tools/single-digit-in-noise-test/",
    cta: "Launch optimization",
    tone: "amber",
  },
  {
    title: "HFEQ-Mandarin Research Preview",
    category: "Everyday functioning PROM",
    description:
      "An ICF-based questionnaire workflow for Mandarin-speaking adults, covering hearing, communication, participation, support, personal resources, and health.",
    status: "In validation",
    href: "/tools/hfeq-mandarin/",
    cta: "Open preview",
    tone: "sky",
  },
  {
    title: "AI-Guided Hearing-Care Workflows",
    category: "AI in hearing care",
    description:
      "Planned tools for AI-supported questionnaire guidance, triage, interpretation, and care-pathway support, developed with human oversight.",
    status: "In development",
    href: "",
    cta: "",
    tone: "neutral",
  },
];

const toneClasses = {
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  sky: "border-sky-200 bg-sky-50 text-sky-800",
  neutral: "border-stone-200 bg-stone-50 text-neutral-600",
};

function PlayIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export default function Tools() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <div className="eyebrow">Digital assessment platform</div>
        <h1>Assessment Tools</h1>
        <p className="mt-5 text-lg text-neutral-700">
          A growing platform for AI-enabled hearing care, speech-in-noise assessment, patient-reported outcomes, and study workflows.
        </p>
      </section>

      <section className="grid gap-4">
        {tools.map((tool) => (
          <article key={tool.title} className={`card ${tool.href ? "" : "opacity-70"}`}>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[tool.tone as keyof typeof toneClasses]}`}>
                  {tool.status}
                </span>
                <p className="mt-4 text-xs font-semibold uppercase text-brand-primary">{tool.category}</p>
                <h2 className="mt-4 text-2xl">{tool.title}</h2>
                <p className="mt-3 text-sm text-neutral-600">{tool.description}</p>
              </div>
              {tool.href ? (
                <a className="btn shrink-0" href={tool.href} target="_blank" rel="noopener noreferrer">
                  <PlayIcon />
                  {tool.cta}
                </a>
              ) : (
                <span className="inline-flex shrink-0 items-center rounded-md border border-stone-200 px-4 py-2 text-sm font-semibold text-neutral-500">
                  In planning
                </span>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
