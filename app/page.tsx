import DinResearchPanel from "./components/DinResearchPanel";
import Link from "next/link";

const stats = [
  { value: "27", label: "Scholar-indexed outputs" },
  { value: "9", label: "DIN language tracks" },
  { value: "2", label: "Live research tools" },
];

const focusAreas = [
  {
    title: "Hearing and cognition",
    text: "Rapid screening methods that connect speech-in-noise performance with cognitive load and everyday listening.",
  },
  {
    title: "Clinical AI",
    text: "Responsible use of AI systems in audiology education, assessment, and hearing-care workflows.",
  },
  {
    title: "Digital assessment",
    text: "Browser-based tools for digit-in-noise testing, calibration, data capture, and translational studies.",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-6 4 12 4-8 2 2h3" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid min-h-[calc(100vh-220px)] gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center">
        <div className="max-w-3xl py-6">
          <div className="eyebrow">The University of Hong Kong</div>
          <h1>HK Audiology Group</h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-700 md:text-xl">
            We build evidence, tools, and clinical insight for better hearing care, with a focus on speech perception in noise,
            cognitive screening, and AI-enabled audiology.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/publications/" className="btn">
              Publications
              <ArrowIcon />
            </Link>
            <Link href="/tools/" className="btn-secondary">
              <WaveIcon />
              Research tools
            </Link>
          </div>

          <dl className="mt-10 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="surface p-4">
                <dt className="text-3xl font-semibold text-neutral-950">{item.value}</dt>
                <dd className="mt-1 text-sm leading-snug text-neutral-500">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0">
          <DinResearchPanel />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="surface p-6 md:p-8">
          <p className="kicker">Mission</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Research that can move into practice.</h2>
          <p className="mt-5 text-base text-neutral-700">
            Our work sits between auditory science, digital health, and service design. The goal is practical:
            make hearing assessment easier to access, easier to interpret, and more useful for people and clinicians.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {focusAreas.map((area, index) => (
            <article key={area.title} className="card">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-sm font-semibold text-brand-primary">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg">{area.title}</h3>
              <p className="mt-3 text-sm text-neutral-600">{area.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
