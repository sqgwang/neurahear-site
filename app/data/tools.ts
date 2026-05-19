export type ToolStatus = "Live" | "In validation" | "In development" | "Restricted";
export type ToolTone = "teal" | "amber" | "sky" | "neutral";

export type ToolItem = {
  title: string;
  shortName: string;
  category: string;
  description: string;
  status: ToolStatus;
  shortStatus: string;
  stage: string;
  href?: string;
  cta: string;
  tone: ToolTone;
  data: string;
  output: string;
  version: string;
  assessmentPathway: boolean;
  platformHighlight: boolean;
};

export const toolItems: ToolItem[] = [
  {
    title: "integrated Digit-in-Noise Test",
    shortName: "iDIN",
    category: "Speech-in-noise assessment",
    description:
      "A browser-based screening workflow with calibration, device checks, adaptive SNR testing, and server-backed data capture.",
    status: "Live",
    shortStatus: "Live",
    stage: "Operational research tool",
    href: "/tools/digit-in-noise-test/",
    cta: "Launch test",
    tone: "teal",
    data: "Responses are submitted to the project backend for study use.",
    output: "Participant-level DIN records and server-side study exports.",
    version: "Active deployment",
    assessmentPathway: true,
    platformHighlight: true,
  },
  {
    title: "Digit Optimization Test",
    shortName: "Digit Optimization",
    category: "Stimulus optimization",
    description: "A fixed-SNR single-digit workflow for estimating PI functions and generating correction levels for sequence synthesis.",
    status: "Live",
    shortStatus: "Live",
    stage: "Stimulus development workflow",
    href: "/tools/single-digit-in-noise-test/",
    cta: "Launch optimization",
    tone: "amber",
    data: "Runs in the browser; individual and pooled results are exported by the researcher.",
    output: "Raw CSV, full JSON, PI summaries, and digit correction arrays.",
    version: "Noise calibration enabled",
    assessmentPathway: true,
    platformHighlight: true,
  },
  {
    title: "HFEQ-Mandarin Research Preview",
    shortName: "HFEQ-Mandarin",
    category: "Everyday functioning PROM",
    description:
      "An ICF-based questionnaire workflow for Mandarin-speaking adults, covering hearing, communication, participation, support, personal resources, and health.",
    status: "In validation",
    shortStatus: "Validation",
    stage: "PROM research preview",
    href: "/tools/hfeq-mandarin/",
    cta: "Open preview",
    tone: "sky",
    data: "Browser-only completion and export for research preview use.",
    output: "Domain scores, item responses, JSON, and CSV.",
    version: "Manuscript-linked preview",
    assessmentPathway: true,
    platformHighlight: true,
  },
  {
    title: "AI-Guided Hearing-Care Workflows",
    shortName: "AI Workflows",
    category: "AI in hearing care",
    description:
      "Planned tools for AI-supported questionnaire guidance, triage, interpretation, and care-pathway support, developed with human oversight.",
    status: "In development",
    shortStatus: "Designing",
    stage: "Design and validation planning",
    href: "/projects/ai-hearing-care/",
    cta: "View research theme",
    tone: "neutral",
    data: "No public tool yet; future tools will separate research data, generated outputs, and review records.",
    output: "Planned: evaluation packages, clinician review exports, and patient-facing explanations.",
    version: "Concept stage",
    assessmentPathway: false,
    platformHighlight: false,
  },
];

export const toolToneClasses: Record<ToolTone, string> = {
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  sky: "border-sky-200 bg-sky-50 text-sky-800",
  neutral: "border-stone-200 bg-stone-50 text-neutral-600",
};

export const toolStatusLegend: Array<{ label: ToolStatus; text: string }> = [
  { label: "Live", text: "Available for current research workflows." },
  { label: "In validation", text: "Usable as a preview while measurement work continues." },
  { label: "In development", text: "Research direction is active, public workflow is still being designed." },
  { label: "Restricted", text: "URL-only study workflow, not listed until protocols are finalized." },
];

export function getToolStats(items: ToolItem[] = toolItems) {
  return {
    total: items.length,
    liveCount: items.filter((tool) => tool.status === "Live").length,
    assessmentPathwayCount: items.filter((tool) => tool.assessmentPathway).length,
    platformHighlightCount: items.filter((tool) => tool.platformHighlight).length,
  };
}

export function getAssessmentToolHighlights(items: ToolItem[] = toolItems) {
  return items
    .filter((tool) => tool.platformHighlight)
    .map((tool) => ({
      name: tool.shortName,
      detail: tool.category,
      status: tool.shortStatus,
      tone: tool.tone,
    }));
}
