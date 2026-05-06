import Link from "next/link";

const waveformBars = [26, 44, 62, 36, 78, 52, 30, 72, 48, 84, 58, 34, 64, 46, 76, 40, 70, 54, 28, 62, 80, 38, 56, 72];

const platformPillars = [
  {
    label: "AI care",
    title: "Decision support",
    text: "Human-centered AI for screening, triage, counseling, and hearing-care workflows.",
  },
  {
    label: "Assessment",
    title: "Digital tools",
    text: "Browser-based measures for speech-in-noise performance and patient-reported outcomes.",
  },
  {
    label: "Validation",
    title: "Real-world evidence",
    text: "Cross-cultural adaptation, psychometrics, and implementation in everyday care contexts.",
  },
];

const assessmentTools = [
  { name: "iDIN", detail: "Integrated digit-in-noise testing", status: "Live" },
  { name: "Digit Optimization", detail: "PI functions and correction levels", status: "Live" },
  { name: "HFEQ-Mandarin", detail: "Everyday functioning PROM", status: "Validation" },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function PlatformResearchPanel() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_18px_60px_rgba(23,23,23,0.08)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-600 via-sky-500 to-amber-500" />
      <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="bg-neutral-950 p-5 text-white sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-teal-200">Research platform</p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                AI-enabled hearing care meets digital assessment
              </h2>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-stone-100">
              Building
            </span>
          </div>

          <div
            role="img"
            aria-label="Signal, questionnaire, and AI model layers for hearing-care assessment"
            className="mt-7 rounded-lg border border-white/10 bg-white/[0.04] p-4"
          >
            <div className="flex h-28 items-end gap-1.5">
              {waveformBars.map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className={`flex-1 rounded-t-sm ${index % 5 === 0 ? "bg-amber-300" : index % 3 === 0 ? "bg-sky-300" : "bg-teal-300"}`}
                  style={{ height: `${height}%`, opacity: 0.42 + (height / 100) * 0.5 }}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-stone-200">
              <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-2">Measure</span>
              <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-2">Model</span>
              <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-2">Care</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {platformPillars.map((pillar) => (
              <div key={pillar.label} className="min-w-0 rounded-md border border-white/10 bg-white/[0.04] p-3">
                <div className="text-xs font-semibold uppercase text-stone-400">{pillar.label}</div>
                <div className="mt-2 text-sm font-semibold text-white">{pillar.title}</div>
                <p className="mt-2 break-words text-xs leading-relaxed text-stone-300">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500">Assessment tools</p>
                <h3 className="mt-2 text-xl font-semibold text-neutral-950">A growing tool registry</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  iDIN and HFEQ-Mandarin are early examples of a broader assessment platform.
                </p>
              </div>
              <span className="text-3xl font-semibold text-neutral-950">3</span>
            </div>

            <div className="mt-5 space-y-2">
              {assessmentTools.map((tool) => (
                <div key={tool.name} className="rounded-md border border-stone-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-neutral-950">{tool.name}</div>
                      <div className="mt-1 break-words text-xs text-neutral-500">{tool.detail}</div>
                    </div>
                    <span className="shrink-0 rounded-full border border-teal-200 bg-teal-50 px-2 py-1 text-[11px] font-semibold text-teal-800">
                      {tool.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-neutral-500">Everyday functioning</p>
            <p className="mt-2 text-sm text-neutral-600">
              HFEQ-Mandarin extends the platform beyond auditory performance into ICF-based daily functioning, communication,
              participation, personal resources, support, and health.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/tools/" className="btn">
              Assessment tools
              <ArrowIcon />
            </Link>
            <Link href="/publications/" className="btn-secondary">
              Evidence base
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
