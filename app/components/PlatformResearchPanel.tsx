import Link from "next/link";
import { getAssessmentToolHighlights, getToolStats, type ToolTone } from "../data/tools";

const platformPillars = [
  {
    label: "AI care",
    title: "Decision support",
  },
  {
    label: "Assessment",
    title: "Digital tools",
  },
  {
    label: "Validation",
    title: "Real-world evidence",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const toolToneDots: Record<ToolTone, string> = {
  teal: "bg-teal-600",
  amber: "bg-amber-600",
  sky: "bg-sky-600",
  neutral: "bg-neutral-400",
};

export default function PlatformResearchPanel() {
  const assessmentTools = getAssessmentToolHighlights();
  const toolStats = getToolStats();

  return (
    <div className="overflow-hidden rounded-lg border border-stone-300 bg-white shadow-[0_20px_60px_rgba(23,23,23,0.07)]">
      <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="bg-neutral-950 p-6 text-white sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase text-teal-300">Research platform</p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                AI-enabled hearing care meets digital assessment
              </h2>
            </div>
            <span className="mt-1 flex shrink-0 items-center gap-2 text-xs font-semibold text-stone-300">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              Active
            </span>
          </div>

          <p className="mt-5 max-w-xl text-sm text-stone-300">
            Evidence, measurement, and responsible AI are developed as one translational research system.
          </p>

          <div className="mt-7 border-y border-white/15">
            {platformPillars.map((pillar, index) => (
              <div key={pillar.label} className="grid min-w-0 grid-cols-[2.5rem_1fr] gap-3 border-b border-white/15 py-4 last:border-b-0">
                <div className="pt-0.5 text-sm font-semibold text-teal-300">0{index + 1}</div>
                <div>
                  <div className="text-xs font-semibold uppercase text-stone-400">{pillar.label}</div>
                  <div className="mt-1 text-base font-semibold text-white">{pillar.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase text-neutral-500">Assessment tools</p>
              <h3 className="mt-2 text-2xl font-semibold text-neutral-950">A growing tool registry</h3>
              <p className="mt-3 text-sm text-neutral-600">
                Current pathways span screening, speech-in-noise measurement, stimulus optimization, and everyday functioning.
              </p>
            </div>
            <span className="text-4xl font-semibold text-neutral-950">{toolStats.platformHighlightCount}</span>
          </div>

          <div className="mt-6 border-y border-stone-200">
            {assessmentTools.map((tool) => (
              <Link key={tool.name} href={tool.href || "/tools/"} className="group flex items-center justify-between gap-4 border-b border-stone-200 py-4 no-underline last:border-b-0">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-neutral-950 transition-colors group-hover:text-brand-primary">{tool.name}</div>
                  <div className="mt-1 break-words text-xs text-neutral-500">{tool.detail}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
                    <span className={`h-2 w-2 rounded-full ${toolToneDots[tool.tone]}`} />
                    {tool.status}
                  </span>
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
