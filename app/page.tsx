import PlatformResearchPanel from "./components/PlatformResearchPanel";
import LatestNews from "./components/LatestNews";
import Link from "next/link";
import { getPublicationStats } from "./data/publications";
import { getToolStats } from "./data/tools";

const focusAreas = [
  {
    title: "AI-enabled hearing care",
    text: "Research on responsible AI systems for hearing-care education, assessment, counseling, and clinical decision support.",
    href: "/projects/ai-hearing-care/",
  },
  {
    title: "Digital assessment tools",
    text: "A growing platform of browser-based assessment tools, including speech-in-noise tests and patient-reported outcomes.",
    href: "/tools/",
  },
  {
    title: "Everyday functioning",
    text: "ICF-informed measures that connect hearing ability with communication, participation, support, and daily-life impact.",
    href: "/tools/hfeq-mandarin/",
  },
];

const platformPathway = [
  {
    step: "Evidence",
    title: "Scholar-linked research record",
    text: "Publications anchor the platform in AI, speech-in-noise testing, everyday functioning, and hearing-care systems.",
    href: "/publications/",
  },
  {
    step: "Measure",
    title: "Browser-based assessment tools",
    text: "iDIN, digit optimization, and HFEQ-Mandarin form the current assessment layer.",
    href: "/tools/",
  },
  {
    step: "Update",
    title: "News and activity archive",
    text: "Recent publications, conferences, tool releases, and group updates stay visible on the homepage and preserved in News.",
    href: "/news/",
  },
  {
    step: "Translate",
    title: "AI-enabled care workflows",
    text: "Future work can connect assessment outputs with AI-supported review, explanation, and clinical translation.",
    href: "/projects/ai-hearing-care/",
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
  const publicationStats = getPublicationStats();
  const toolStats = getToolStats();
  const stats = [
    { value: String(publicationStats.total), label: "Scholar-indexed outputs" },
    { value: String(toolStats.assessmentPathwayCount), label: "Assessment pathways" },
    { value: "9", label: "DIN language tracks" },
  ];

  return (
    <div className="space-y-16">
      <section className="grid min-h-[calc(100vh-220px)] gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center">
        <div className="max-w-3xl py-6">
          <div className="eyebrow">The University of Hong Kong</div>
          <h1>HK Audiology Group</h1>
          <p className="mt-6 max-w-2xl text-lg text-neutral-700 md:text-xl">
            We build AI-enabled hearing-care research and digital assessment tools for speech-in-noise performance,
            everyday functioning, and clinical translation.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/publications/" className="btn">
              Publications
              <ArrowIcon />
            </Link>
            <Link href="/tools/" className="btn-secondary">
              <WaveIcon />
              Assessment tools
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
          <PlatformResearchPanel />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="surface p-6 md:p-8">
          <p className="kicker">Mission</p>
          <h2 className="mt-3 text-3xl md:text-4xl">Research that can move into practice.</h2>
          <p className="mt-5 text-base text-neutral-700">
            Our work sits between auditory science, digital health, AI, and service design. The goal is practical:
            make hearing assessment easier to access, easier to interpret, and more useful for people and clinicians.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {focusAreas.map((area, index) => (
            <Link key={area.title} href={area.href} className="card group block no-underline">
              <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-sm font-semibold text-brand-primary">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg transition-colors group-hover:text-brand-primary">{area.title}</h3>
              <p className="mt-3 text-sm text-neutral-600">{area.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="surface overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="border-b border-stone-200 p-6 md:p-8 lg:border-b-0 lg:border-r">
            <p className="kicker">Platform pathway</p>
            <h2 className="mt-3 text-3xl md:text-4xl">From research evidence to usable assessment tools.</h2>
            <p className="mt-5 text-sm text-neutral-700">
              The site now works as a living front door for the group: publications provide the evidence base, tools provide
              the measurement layer, and news keeps the activity record current.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-2">
            {platformPathway.map((item, index) => (
              <Link
                key={item.step}
                href={item.href}
                className={`group block border-b border-stone-200 p-5 no-underline transition-colors hover:bg-stone-50 md:border-r ${
                  index % 2 === 1 ? "md:border-r-0" : ""
                } ${index >= 2 ? "md:border-b-0" : ""}`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">{item.step}</div>
                <h3 className="mt-3 text-xl transition-colors group-hover:text-brand-primary">{item.title}</h3>
                <p className="mt-3 text-sm text-neutral-600">{item.text}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 transition-colors group-hover:text-brand-primary">
                  Open
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LatestNews />
    </div>
  );
}
