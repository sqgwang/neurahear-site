const tools = [
  {
    title: "integrated Digit-in-Noise Test",
    description:
      "A browser-based screening workflow with calibration, device checks, adaptive SNR testing, and server-backed data capture.",
    status: "Live",
    href: "/tools/digit-in-noise-test/",
    cta: "Launch test",
    tone: "teal",
  },
  {
    title: "Single Digit-in-Noise Test",
    description: "A fixed-SNR R&D task for PI-function development and digit-level balancing studies.",
    status: "R&D",
    href: "/tools/single-digit-in-noise-test/",
    cta: "Launch R&D test",
    tone: "amber",
  },
  {
    title: "Online Questionnaire",
    description: "Recruitment and follow-up questionnaire integration for future study workflows.",
    status: "Coming soon",
    href: "",
    cta: "",
    tone: "neutral",
  },
];

const toneClasses = {
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
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
        <div className="eyebrow">Research infrastructure</div>
        <h1>Research Tools</h1>
        <p className="mt-5 text-lg text-neutral-700">Interactive tools for hearing assessment, pilot testing, and data collection.</p>
      </section>

      <section className="grid gap-4">
        {tools.map((tool) => (
          <article key={tool.title} className={`card ${tool.href ? "" : "opacity-70"}`}>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[tool.tone as keyof typeof toneClasses]}`}>
                  {tool.status}
                </span>
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
