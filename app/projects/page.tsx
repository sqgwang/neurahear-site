import Link from "next/link";

const projects = [
  {
    title: "Digital Hearing and Cognitive Screening",
    description: "Integrated digit-in-noise methods for rapid hearing and cognitive assessment.",
    tag: "Screening",
    link: "/tools/",
  },
  {
    title: "Everyday Functioning and Hearing Loss",
    description: "Studies of how hearing ability shapes communication, memory, and daily participation.",
    tag: "Outcomes",
    link: "/tools/hfeq-mandarin/",
  },
  {
    title: "AI-Enabled Hearing Care",
    description: "Evaluation of language models, patient explanations, audiology education, and AI-supported care pathways.",
    tag: "AI",
    link: "/projects/ai-hearing-care/",
  },
  {
    title: "Hearing Healthcare in China",
    description: "Workforce, access, clinical roles, and service-design research in Mainland China.",
    tag: "Health services",
    link: "/projects/hearing-healthcare-china",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Projects() {
  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <div className="eyebrow">Research portfolio</div>
        <h1>Research Projects</h1>
        <p className="mt-5 text-lg text-neutral-700">
          A compact view of the group&apos;s current work across hearing science, clinical tools, AI, and health services.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <Link key={project.title} href={project.link} className="card group block no-underline">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="kicker">{project.tag}</div>
                <h2 className="mt-3 text-2xl transition-colors group-hover:text-brand-primary">{project.title}</h2>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-stone-50 text-sm font-semibold text-neutral-500">
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>
            <p className="mt-5 text-sm text-neutral-600">{project.description}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 transition-colors group-hover:text-brand-primary">
              Learn more
              <ArrowIcon />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
