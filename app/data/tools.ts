export type ToolStatus = "Live" | "In validation" | "In development" | "Restricted";
export type ToolTone = "teal" | "amber" | "sky" | "neutral";
export type ReleaseStatus = "Released" | "Baseline" | "Planned";

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

export type ToolReleaseNote = {
  date: string;
  title: string;
  tool: string;
  version: string;
  status: ReleaseStatus;
  tone: ToolTone;
  summary: string;
  changes: string[];
  dataBoundary: string;
  href?: string;
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
    version: "Calibration and dashboard UX refinement",
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

export const toolReleaseNotes: ToolReleaseNote[] = [
  {
    date: "2026-06-10",
    title: "iDIN calibration and dashboard workflow refined",
    tool: "integrated Digit-in-Noise Test",
    version: "iDIN 2026.06 flow and dashboard UX",
    status: "Released",
    tone: "teal",
    summary:
      "The iDIN workflow now has clearer noise calibration controls, smoother in-test transition messages, and stronger researcher dashboard filtering and export tools.",
    changes: [
      "Added calibration gain and dB readouts, direct dB entry, -1 dB/+1 dB controls, and reset while preserving the existing fixed-noise-gain algorithm.",
      "Replaced normal practice/formal transition alerts with inline status messages and short automatic continuation delays.",
      "Added dashboard filters, QC summary tiles, and current-list CSV export for researcher review.",
    ],
    dataBoundary:
      "Front-end workflow and dashboard UI changed only; audio mixing formulas, adaptive scoring, and existing server-side result records are unchanged.",
    href: "/tools/digit-in-noise-test/",
  },
  {
    date: "2026-06-10",
    title: "iDIN sequence-level SNR definition documented",
    tool: "integrated Digit-in-Noise Test",
    version: "iDIN 2026.06 SNR documentation",
    status: "Released",
    tone: "teal",
    summary:
      "The iDIN implementation notes now explicitly define SNR matching as a corrected sequence-level operation, not per-digit SNR matching.",
    changes: [
      "Documented that digit waveforms are RMS-normalized before digit-specific correction levels are applied.",
      "Clarified that corrected digits are synthesized into a sequence before global SNR matching against noise.",
      "Clarified that identical digits may have different realized single-digit SNRs across sequences, by design.",
    ],
    dataBoundary:
      "Documentation and version metadata changed only; the mixing algorithm, adaptive rule, and existing server-side results are unchanged.",
    href: "/tools/digit-in-noise-test/",
  },
  {
    date: "2026-06-10",
    title: "iDIN setup and dashboard wording refined",
    tool: "integrated Digit-in-Noise Test",
    version: "iDIN 2026.06 setup refinement",
    status: "Released",
    tone: "teal",
    summary:
      "The integrated DIN setup page now requires participant IDs, and the researcher dashboard has fully English action wording.",
    changes: [
      "Made Participant ID a required setup field with both browser-level and script-level validation.",
      "Changed the dashboard result action button from Chinese wording to English.",
      "Bumped the iDIN static asset version so deployed browsers pick up the updated files.",
    ],
    dataBoundary:
      "Static iDIN front-end files changed only; existing server-side JSONL results and backend storage are not modified by this release.",
    href: "/tools/digit-in-noise-test/",
  },
  {
    date: "2026-06-10",
    title: "iDIN condition order randomization added",
    tool: "integrated Digit-in-Noise Test",
    version: "iDIN 2026.06 condition-order release",
    status: "Released",
    tone: "teal",
    summary:
      "The integrated DIN setup page now supports optional randomization of selected test conditions and exposes a researcher dashboard entry from the iDIN landing page.",
    changes: [
      "Added a researcher dashboard link on the iDIN landing page.",
      "Added an optional randomize-condition-order checkbox during participant setup.",
      "Stored the original selected condition order, executed condition order, randomization flag, and generation timestamp in the result metadata.",
    ],
    dataBoundary:
      "Static iDIN front-end files changed only; existing server-side JSONL results and backend storage are not modified by this release.",
    href: "/tools/digit-in-noise-test/",
  },
  {
    date: "2026-06-10",
    title: "iDIN playback and audio asset baseline tightened",
    tool: "integrated Digit-in-Noise Test",
    version: "iDIN 2026.06 stability release",
    status: "Released",
    tone: "teal",
    summary:
      "The integrated DIN workflow now has stronger playback-state handling, cache-busted static assets, clearer formal/practice export metadata, and shorter noise files for faster loading.",
    changes: [
      "Prevented repeated Play/OK actions from creating unstable trial states.",
      "Separated formal-trial metrics from practice-trial records in result summaries and exports.",
      "Trimmed long language noise files to approximately 30 seconds without changing sample rate, channel count, bit depth, or digit stimuli.",
      "Added versioned CSS/JS references so browsers fetch the current iDIN interface after deployment.",
    ],
    dataBoundary:
      "Static tool files and audio assets changed; the server-side iDIN results JSONL data directory is not modified by this release.",
    href: "/tools/digit-in-noise-test/",
  },
  {
    date: "2026-05-20",
    title: "Public version log established",
    tool: "NeuraHear platform",
    version: "Site release 2026.05.20",
    status: "Released",
    tone: "teal",
    summary:
      "A public version and credibility layer now records the current tool baseline, release notes, contact route, and data-boundary statements.",
    changes: [
      "Added a research contact page and connected it to navigation, footer, sitemap, and structured data.",
      "Added tool study-planning cues so researchers can check versioning, calibration, export format, and backup expectations before use.",
      "Established this version log as the place to record future tool-facing releases.",
    ],
    dataBoundary: "Static website content only; the iDIN server data directory and study records are not modified by this release.",
    href: "/contact/",
  },
  {
    date: "2026-05-20",
    title: "Current assessment-tool baseline captured",
    tool: "Assessment tools",
    version: "Baseline 2026.05",
    status: "Baseline",
    tone: "amber",
    summary:
      "The public tool registry now makes each tool's stage, validation status, data handling, outputs, and version note visible from the Tools page.",
    changes: [
      "iDIN remains the operational server-backed speech-in-noise workflow.",
      "Digit Optimization is listed as a live stimulus-development workflow with noise calibration enabled.",
      "HFEQ-Mandarin is listed as an in-validation PROM research preview.",
    ],
    dataBoundary: "The baseline is a documentation snapshot; individual tool behavior remains governed by each tool page and deployment route.",
    href: "/tools/",
  },
  {
    date: "2026-05-20",
    title: "Discovery metadata and sitemap hardened",
    tool: "NeuraHear platform",
    version: "SEO release 2026.05",
    status: "Released",
    tone: "sky",
    summary:
      "The site now publishes route metadata, canonical URLs, robots rules, sitemap entries, and social-card metadata for better indexing and sharing.",
    changes: [
      "Added site-wide metadata defaults and page-level metadata helpers.",
      "Added robots and sitemap generation for primary public routes.",
      "Added public social-card metadata for shared links.",
    ],
    dataBoundary: "Static discovery metadata only; no participant records or test data are touched.",
    href: "/sitemap.xml",
  },
];

export const versionLogPrinciples = [
  {
    label: "Document the current baseline",
    text: "Each public research tool should show its stage, status, data handling, outputs, and version note before use.",
  },
  {
    label: "Separate interface updates from study data",
    text: "Static site releases should not overwrite server-backed records such as iDIN participant results.",
  },
  {
    label: "Record meaningful behavior changes",
    text: "Calibration, stimuli, scoring, export format, and backend changes should be logged before a tool is used for new data collection.",
  },
] as const;

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
