import Link from "next/link";
import { createPageMetadata } from "../../data/site";

export const metadata = createPageMetadata({
  title: "AI-Enabled Hearing Care",
  description:
    "Research on responsible AI systems for hearing-care education, assessment, counseling, triage, and clinical decision support.",
  path: "/projects/ai-hearing-care/",
});

const workstreams = [
  {
    title: "AI-supported clinical reasoning",
    text: "Evaluate how language models interpret audiology histories, audiograms, symptoms, urgency cues, and management options.",
  },
  {
    title: "Patient-facing explanations",
    text: "Study whether AI-generated hearing-care information is accurate, understandable, actionable, and appropriately reassuring.",
  },
  {
    title: "Audiology education and workforce support",
    text: "Explore how generative AI can broaden access to training resources, continuing education, and clinical learning materials.",
  },
  {
    title: "Model evaluation and safety",
    text: "Develop review workflows that compare AI outputs against expert judgment, missing information, and potential safety risks.",
  },
];

const platformLinks = [
  {
    title: "Publications",
    text: "Recent papers and commentaries on AI chatbots, audiology education, and hearing-care applications.",
    href: "/publications/",
  },
  {
    title: "Assessment tools",
    text: "Digital tools that create the measurement layer for AI-enabled hearing-care workflows.",
    href: "/tools/",
  },
  {
    title: "Hearing healthcare in China",
    text: "Health-services work on audiology roles, access, workforce, and professional identity.",
    href: "/projects/hearing-healthcare-china/",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function AiHearingCareProject() {
  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
        <div className="max-w-4xl">
          <div className="eyebrow">Research theme</div>
          <h1>AI-Enabled Hearing Care</h1>
          <p className="mt-5 text-lg text-neutral-700">
            We study how AI systems can support hearing-care education, assessment, counseling, triage, and clinical decision support while preserving expert oversight.
          </p>
        </div>
        <div className="surface p-5">
          <p className="kicker">Positioning</p>
          <p className="mt-3 text-sm text-neutral-700">
            The goal is not to replace audiologists. The goal is to evaluate where AI can make hearing care more accessible, understandable, and evidence-informed.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {workstreams.map((item, index) => (
          <article key={item.title} className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="kicker">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-2xl">{item.title}</h2>
              </div>
              <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                Active
              </span>
            </div>
            <p className="mt-4 text-sm text-neutral-600">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="surface overflow-hidden">
        <div className="border-b border-stone-200 px-5 py-4">
          <p className="kicker">Evaluation pathway</p>
          <h2 className="mt-3 text-2xl">From measurement to AI review to clinical translation.</h2>
        </div>
        <div className="grid gap-0 md:grid-cols-3">
          {[
            ["Measure", "Collect structured hearing, speech-in-noise, questionnaire, and clinical-context data."],
            ["Model", "Generate or evaluate AI outputs with clear prompts, version records, and human review criteria."],
            ["Translate", "Study whether outputs improve education, access, communication, or care-pathway decisions."],
          ].map(([label, text]) => (
            <div key={label} className="border-b border-stone-200 p-5 md:border-b-0 md:border-r last:md:border-r-0">
              <h3 className="text-xl">{label}</h3>
              <p className="mt-3 text-sm text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {platformLinks.map((item) => (
          <Link key={item.title} href={item.href} className="card group block no-underline">
            <h2 className="text-2xl transition-colors group-hover:text-brand-primary">{item.title}</h2>
            <p className="mt-4 text-sm text-neutral-600">{item.text}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 transition-colors group-hover:text-brand-primary">
              Open
              <ArrowIcon />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
