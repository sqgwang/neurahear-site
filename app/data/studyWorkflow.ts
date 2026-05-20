export const workflowPhases = [
  {
    step: "01",
    label: "Plan",
    title: "Define the study mode",
    text: "Decide whether the workflow is a public demonstration, a browser-only pilot, a restricted study link, or a server-backed data collection route.",
    checks: ["Participant group and language", "Study protocol and consent context", "Target tool and expected outputs"],
    output: "Documented study mode",
  },
  {
    step: "02",
    label: "Configure",
    title: "Freeze the tool baseline",
    text: "Record the tool version, audio set, calibration behavior, scoring logic, export fields, and any restricted access assumptions before recruitment starts.",
    checks: ["Tool version note", "Stimulus and language version", "Export schema and backup path"],
    output: "Versioned study setup",
  },
  {
    step: "03",
    label: "Calibrate",
    title: "Confirm playback and listening setup",
    text: "Run the intended device and sound-level checks before testing so participants use a consistent listening setup and the noise or speech level is documented.",
    checks: ["Headphone or speaker plan", "Noise calibration procedure", "Participant instruction wording"],
    output: "Ready-to-test setup",
  },
  {
    step: "04",
    label: "Collect",
    title: "Monitor records while data collection is live",
    text: "For server-backed tools, check that new records are appended rather than replacing existing files. For browser-only tools, confirm local exports are saved after each session.",
    checks: ["Record count monitoring", "Failed-submission handling", "Session export confirmation"],
    output: "Traceable raw data",
  },
  {
    step: "05",
    label: "Export",
    title: "Archive raw and analysis-ready outputs",
    text: "Keep raw records, exported CSV or JSON files, and analysis summaries separate so later scoring updates do not obscure the original participant data.",
    checks: ["Raw data archive", "Analysis-ready export", "Version note included with files"],
    output: "Reproducible study package",
  },
] as const;

export const dataCollectionModes = [
  {
    label: "Browser-only",
    bestFor: "Pilots, demonstrations, questionnaires, and workflows where the researcher saves the export manually.",
    data: "No server submission by default. Results are exported from the browser as JSON, CSV, or summary text.",
    safeguards: ["Explain export responsibility", "Avoid collecting identifiable data unless approved", "Keep version notes with exported files"],
  },
  {
    label: "Server-backed",
    bestFor: "Live study tools where participant records need to be appended to a server-side data file or database.",
    data: "Responses are submitted to a backend route and stored outside the static website release directory.",
    safeguards: ["Back up before deployment", "Monitor record counts", "Keep static releases separate from study data"],
  },
  {
    label: "Restricted link",
    bestFor: "Study-specific experiments, review consoles, or tools that should not be listed until protocols are finalized.",
    data: "The tool may be deployed but kept out of public tool lists and navigation until the study is ready.",
    safeguards: ["Avoid public listing", "Confirm consent language", "Log activation and deactivation dates"],
  },
] as const;

export const studyReleaseChecklist = [
  "Tool URL and version log entry are confirmed",
  "Language, audio stimuli, and calibration flow are frozen",
  "Participant instructions match the actual page flow",
  "Consent and study protocol language are finalized where required",
  "Data mode is clear: browser-only, server-backed, or restricted link",
  "Export fields and file formats are documented",
  "Backup and rollback plan are checked before deployment",
  "A small pilot run is inspected before recruiting more participants",
] as const;

export const workflowBoundaries = [
  {
    label: "Research support",
    text: "The platform can support research workflows, tool previews, stimulus development, and study exports.",
  },
  {
    label: "Not clinical service",
    text: "Public pages should avoid implying diagnostic or clinical readiness unless validation, governance, and review language are explicitly in place.",
  },
  {
    label: "Data first",
    text: "When a tool is server-backed, protecting existing records has priority over visual or content updates.",
  },
] as const;
