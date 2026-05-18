"use client";

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type Material = {
  id: string;
  title: string;
  text: string;
};

type ReviewImage = {
  id: string;
  label: string;
  dataUrl: string;
};

type DiagnosticOutput = {
  id: string;
  displayName: string;
  content: unknown;
};

type PatientTextOutput = {
  id: string;
  displayName: string;
  text: string;
};

type PatientImageOutput = {
  id: string;
  displayName: string;
  dataUrl: string;
  prompt?: string;
};

type ReviewCase = {
  caseId: string;
  provisionalLabel?: string;
  broadGroup?: string;
  materials: Material[];
  images: ReviewImage[];
  diagnosticOutputs?: DiagnosticOutput[];
  patientTextOutputs?: PatientTextOutput[];
  patientImageOutputs?: PatientImageOutput[];
};

type ReviewPackage = {
  studyId: string;
  version: string;
  createdAt?: string;
  instructions?: string;
  cases: ReviewCase[];
};

type GoldReview = {
  mainDiagnosis: string;
  broadGroup: string;
  rightType: string;
  leftType: string;
  rightDegree: string;
  leftDegree: string;
  urgency: string;
  nextSteps: string;
  redFlags: string;
  confidence: string;
  evidence: string;
  missingInfo: string;
  comments: string;
};

type AiReview = {
  diagnosisCorrect: string;
  hearingCorrect: string;
  evidenceQuality: string;
  managementQuality: string;
  safetyConcern: string;
  confidenceAppropriate: string;
  comments: string;
};

type PatientReview = {
  medicalAccuracy: string;
  clarity: string;
  actionability: string;
  reassurance: string;
  misleadingRisk: string;
  comments: string;
};

type CaseReview = {
  goldLocked: boolean;
  gold: GoldReview;
  ai: Record<string, AiReview>;
  patientText: Record<string, PatientReview>;
  patientImage: Record<string, PatientReview>;
  updatedAt?: string;
};

type ReviewState = {
  reviewerId: string;
  reviewerName: string;
  startedAt: string;
  packageStudyId: string;
  packageVersion: string;
  cases: Record<string, CaseReview>;
};

const emptyGold: GoldReview = {
  mainDiagnosis: "",
  broadGroup: "",
  rightType: "",
  leftType: "",
  rightDegree: "",
  leftDegree: "",
  urgency: "",
  nextSteps: "",
  redFlags: "",
  confidence: "",
  evidence: "",
  missingInfo: "",
  comments: "",
};

const emptyAi: AiReview = {
  diagnosisCorrect: "",
  hearingCorrect: "",
  evidenceQuality: "",
  managementQuality: "",
  safetyConcern: "",
  confidenceAppropriate: "",
  comments: "",
};

const emptyPatient: PatientReview = {
  medicalAccuracy: "",
  clarity: "",
  actionability: "",
  reassurance: "",
  misleadingRisk: "",
  comments: "",
};

const broadGroups = [
  "tinnitus_specific",
  "tinnitus_unspecified",
  "sudden_sensorineural_hearing_loss",
  "sensorineural_hearing_loss",
  "hearing_loss_unspecified",
  "acute_otitis_media",
  "otitis_media_with_effusion",
  "otitis_media_unspecified",
  "cholesteatoma",
  "external_ear_disease",
  "ear_trauma",
  "obstructive_external_ear",
  "inner_ear_or_vestibular",
  "other_or_unlabeled",
];

const hearingTypes = ["normal", "conductive", "sensorineural", "mixed", "indeterminate"];
const hearingDegrees = ["normal", "slight", "mild", "moderate", "moderately_severe", "severe", "profound", "indeterminate"];
const urgencies = ["routine", "expedited", "urgent_same_day", "emergency", "indeterminate"];
const correctnessOptions = ["correct", "partly_correct", "incorrect", "not_judgeable"];
const yesNoOptions = ["no", "minor", "major", "not_judgeable"];
const ratingOptions = ["1", "2", "3", "4", "5", "not_judgeable"];

function cloneGold() {
  return { ...emptyGold };
}

function cloneAi() {
  return { ...emptyAi };
}

function clonePatient() {
  return { ...emptyPatient };
}

function createCaseReview(): CaseReview {
  return {
    goldLocked: false,
    gold: cloneGold(),
    ai: {},
    patientText: {},
    patientImage: {},
  };
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function safeJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function flattenForCsv(state: ReviewState, pkg: ReviewPackage) {
  const header = [
    "study_id",
    "reviewer_id",
    "case_id",
    "section",
    "output_id",
    "field",
    "value",
  ];
  const rows: string[] = [];

  for (const reviewCase of pkg.cases) {
    const caseReview = state.cases[reviewCase.caseId] || createCaseReview();
    Object.entries(caseReview.gold).forEach(([field, value]) => {
      rows.push([pkg.studyId, state.reviewerId, reviewCase.caseId, "gold", "", field, value].map(csvCell).join(","));
    });
    Object.entries(caseReview.ai).forEach(([outputId, review]) => {
      Object.entries(review).forEach(([field, value]) => {
        rows.push([pkg.studyId, state.reviewerId, reviewCase.caseId, "ai_diagnostic", outputId, field, value].map(csvCell).join(","));
      });
    });
    Object.entries(caseReview.patientText).forEach(([outputId, review]) => {
      Object.entries(review).forEach(([field, value]) => {
        rows.push([pkg.studyId, state.reviewerId, reviewCase.caseId, "patient_text", outputId, field, value].map(csvCell).join(","));
      });
    });
    Object.entries(caseReview.patientImage).forEach(([outputId, review]) => {
      Object.entries(review).forEach(([field, value]) => {
        rows.push([pkg.studyId, state.reviewerId, reviewCase.caseId, "patient_image", outputId, field, value].map(csvCell).join(","));
      });
    });
  }

  return [header.join(","), ...rows].join("\n");
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-neutral-800">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-md border-stone-300 text-sm">
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  rows?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-neutral-800">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border-stone-300 text-sm"
      />
    </label>
  );
}

function RatingField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return <FieldSelect label={label} value={value} options={ratingOptions} onChange={onChange} />;
}

export default function ExpertReviewTool() {
  const [pkg, setPkg] = useState<ReviewPackage | null>(null);
  const [state, setState] = useState<ReviewState | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadError, setLoadError] = useState("");

  const activeCase = pkg?.cases[activeIndex] || null;
  const activeReview = activeCase && state ? state.cases[activeCase.caseId] || createCaseReview() : null;
  const storageKey = pkg && state ? `expert-review:${pkg.studyId}:${state.reviewerId || "anonymous"}` : "";

  useEffect(() => {
    if (!storageKey || !state) return;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  const progress = useMemo(() => {
    if (!pkg || !state) return { locked: 0, total: 0 };
    return {
      locked: pkg.cases.filter((item) => state.cases[item.caseId]?.goldLocked).length,
      total: pkg.cases.length,
    };
  }, [pkg, state]);

  const loadPackage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoadError("");
    try {
      const parsed = JSON.parse(await file.text()) as ReviewPackage;
      if (!parsed.cases?.length) throw new Error("Package has no cases.");
      setPkg(parsed);
      const initialCases = Object.fromEntries(parsed.cases.map((item) => [item.caseId, createCaseReview()]));
      setState({
        reviewerId: "",
        reviewerName: "",
        startedAt: new Date().toISOString(),
        packageStudyId: parsed.studyId,
        packageVersion: parsed.version,
        cases: initialCases,
      });
      setActiveIndex(0);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not read package.");
    }
  };

  const importReview = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoadError("");
    try {
      const parsed = JSON.parse(await file.text()) as ReviewState;
      if (!parsed.cases) throw new Error("Review file does not include cases.");
      setState(parsed);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not import review.");
    }
  };

  const updateState = (updater: (draft: ReviewState) => ReviewState) => {
    setState((current) => (current ? updater(current) : current));
  };

  const updateCase = (caseId: string, updater: (review: CaseReview) => CaseReview) => {
    updateState((current) => ({
      ...current,
      cases: {
        ...current.cases,
        [caseId]: {
          ...updater(current.cases[caseId] || createCaseReview()),
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  };

  const updateGold = (field: keyof GoldReview, value: string) => {
    if (!activeCase) return;
    updateCase(activeCase.caseId, (review) => ({
      ...review,
      gold: { ...review.gold, [field]: value },
    }));
  };

  const updateAi = (outputId: string, field: keyof AiReview, value: string) => {
    if (!activeCase) return;
    updateCase(activeCase.caseId, (review) => ({
      ...review,
      ai: {
        ...review.ai,
        [outputId]: { ...(review.ai[outputId] || cloneAi()), [field]: value },
      },
    }));
  };

  const updatePatient = (kind: "patientText" | "patientImage", outputId: string, field: keyof PatientReview, value: string) => {
    if (!activeCase) return;
    updateCase(activeCase.caseId, (review) => ({
      ...review,
      [kind]: {
        ...review[kind],
        [outputId]: { ...(review[kind][outputId] || clonePatient()), [field]: value },
      },
    }));
  };

  const exportJson = () => {
    if (!pkg || !state) return;
    const payload = {
      exportedAt: new Date().toISOString(),
      packageMeta: {
        studyId: pkg.studyId,
        version: pkg.version,
        createdAt: pkg.createdAt,
      },
      review: state,
    };
    downloadFile(`expert-review-${pkg.studyId}-${state.reviewerId || "reviewer"}.json`, safeJson(payload), "application/json;charset=utf-8");
  };

  const exportCsv = () => {
    if (!pkg || !state) return;
    downloadFile(`expert-review-${pkg.studyId}-${state.reviewerId || "reviewer"}.csv`, flattenForCsv(state, pkg), "text/csv;charset=utf-8");
  };

  if (!pkg || !state || !activeCase || !activeReview) {
    return (
      <section className="surface p-6">
        <h2 className="text-2xl">Load review package</h2>
        <p className="mt-3 text-sm text-neutral-600">
          Select the JSON package provided by the study team. No case data is uploaded to the website.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block rounded-lg border border-dashed border-stone-300 bg-white p-5">
            <span className="text-sm font-semibold text-neutral-800">Review package JSON</span>
            <input type="file" accept="application/json,.json" onChange={loadPackage} className="mt-3 block w-full text-sm" />
          </label>
          <label className="block rounded-lg border border-dashed border-stone-300 bg-white p-5">
            <span className="text-sm font-semibold text-neutral-800">Resume from prior review JSON</span>
            <input type="file" accept="application/json,.json" onChange={importReview} className="mt-3 block w-full text-sm" />
          </label>
        </div>
        {loadError ? <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{loadError}</div> : null}
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="self-start rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-28">
        <div>
          <p className="kicker">{pkg.studyId}</p>
          <h2 className="mt-2 text-xl">Cases</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Locked {progress.locked}/{progress.total}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase text-neutral-500">Reviewer ID</span>
            <input
              value={state.reviewerId}
              onChange={(event) => updateState((current) => ({ ...current, reviewerId: event.target.value }))}
              className="mt-1 w-full rounded-md border-stone-300 text-sm"
              placeholder="e.g. R01"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase text-neutral-500">Reviewer name</span>
            <input
              value={state.reviewerName}
              onChange={(event) => updateState((current) => ({ ...current, reviewerName: event.target.value }))}
              className="mt-1 w-full rounded-md border-stone-300 text-sm"
              placeholder="optional"
            />
          </label>
        </div>
        <div className="mt-5 max-h-[45vh] space-y-1 overflow-y-auto pr-1">
          {pkg.cases.map((item, index) => {
            const locked = state.cases[item.caseId]?.goldLocked;
            return (
              <button
                key={item.caseId}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  index === activeIndex ? "bg-neutral-950 text-white" : "bg-stone-50 text-neutral-700 hover:bg-stone-100"
                }`}
              >
                <span>{item.caseId}</span>
                <span className={index === activeIndex ? "text-white/75" : "text-neutral-400"}>{locked ? "locked" : "open"}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 grid gap-2">
          <button type="button" onClick={exportJson} className="btn w-full">
            Export JSON
          </button>
          <button type="button" onClick={exportCsv} className="btn-secondary w-full">
            Export CSV
          </button>
        </div>
      </aside>

      <main className="space-y-6">
        <section className="surface p-5 md:p-6">
          <div className="flex flex-col gap-3 border-b border-stone-200 pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="kicker">Case {activeIndex + 1} of {pkg.cases.length}</p>
              <h2 className="mt-2 text-3xl">{activeCase.caseId}</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Tracking label: {activeCase.provisionalLabel || "not provided"} · {activeCase.broadGroup || "unlabeled"}
              </p>
            </div>
            <div className={`rounded-md border px-3 py-2 text-sm font-semibold ${activeReview.goldLocked ? "border-teal-200 bg-teal-50 text-teal-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
              {activeReview.goldLocked ? "Gold judgment locked" : "Gold judgment open"}
            </div>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-3">
              <h3 className="text-xl">Case materials</h3>
              {activeCase.materials.map((material) => (
                <details key={material.id} className="rounded-lg border border-stone-200 bg-white">
                  <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-neutral-900">{material.title}</summary>
                  <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap border-t border-stone-200 p-4 text-xs leading-relaxed text-neutral-700">
                    {material.text}
                  </pre>
                </details>
              ))}
            </div>
            <div className="space-y-3">
              <h3 className="text-xl">Images</h3>
              {activeCase.images.length ? (
                activeCase.images.map((image) => (
                  <figure key={image.id} className="rounded-lg border border-stone-200 bg-white p-3">
                    <figcaption className="mb-2 text-sm font-semibold text-neutral-800">{image.label}</figcaption>
                    <img src={image.dataUrl} alt={image.label} className="w-full rounded-md border border-stone-100 bg-white" />
                  </figure>
                ))
              ) : (
                <p className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm text-neutral-600">No images in this package.</p>
              )}
            </div>
          </div>
        </section>

        <section className="surface p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="kicker">Step 1</p>
              <h2 className="mt-2 text-2xl">Independent expert judgment</h2>
            </div>
            <button
              type="button"
              onClick={() => updateCase(activeCase.caseId, (review) => ({ ...review, goldLocked: !review.goldLocked }))}
              className={activeReview.goldLocked ? "btn-secondary" : "btn"}
            >
              {activeReview.goldLocked ? "Unlock" : "Lock judgment"}
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TextField label="Main diagnosis" value={activeReview.gold.mainDiagnosis} onChange={(value) => updateGold("mainDiagnosis", value)} rows={2} />
            <FieldSelect label="Broad group" value={activeReview.gold.broadGroup} options={broadGroups} onChange={(value) => updateGold("broadGroup", value)} />
            <FieldSelect label="Urgency" value={activeReview.gold.urgency} options={urgencies} onChange={(value) => updateGold("urgency", value)} />
            <FieldSelect label="Right hearing-loss type" value={activeReview.gold.rightType} options={hearingTypes} onChange={(value) => updateGold("rightType", value)} />
            <FieldSelect label="Left hearing-loss type" value={activeReview.gold.leftType} options={hearingTypes} onChange={(value) => updateGold("leftType", value)} />
            <FieldSelect label="Right degree" value={activeReview.gold.rightDegree} options={hearingDegrees} onChange={(value) => updateGold("rightDegree", value)} />
            <FieldSelect label="Left degree" value={activeReview.gold.leftDegree} options={hearingDegrees} onChange={(value) => updateGold("leftDegree", value)} />
            <FieldSelect label="Confidence" value={activeReview.gold.confidence} options={["0-25", "26-50", "51-75", "76-100"]} onChange={(value) => updateGold("confidence", value)} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField label="Key evidence" value={activeReview.gold.evidence} onChange={(value) => updateGold("evidence", value)} />
            <TextField label="Red flags" value={activeReview.gold.redFlags} onChange={(value) => updateGold("redFlags", value)} />
            <TextField label="Recommended next steps" value={activeReview.gold.nextSteps} onChange={(value) => updateGold("nextSteps", value)} />
            <TextField label="Missing information / uncertainty" value={activeReview.gold.missingInfo} onChange={(value) => updateGold("missingInfo", value)} />
            <div className="md:col-span-2">
              <TextField label="Comments" value={activeReview.gold.comments} onChange={(value) => updateGold("comments", value)} rows={3} />
            </div>
          </div>
        </section>

        <section className={`surface p-5 md:p-6 ${activeReview.goldLocked ? "" : "opacity-60"}`}>
          <p className="kicker">Step 2</p>
          <h2 className="mt-2 text-2xl">AI diagnostic output review</h2>
          {!activeReview.goldLocked ? <p className="mt-3 text-sm text-amber-800">Lock the independent judgment before rating AI outputs.</p> : null}
          {activeCase.diagnosticOutputs?.length ? (
            <div className="mt-5 space-y-5">
              {activeCase.diagnosticOutputs.map((output) => {
                const review = activeReview.ai[output.id] || cloneAi();
                return (
                  <div key={output.id} className="rounded-lg border border-stone-200 bg-white p-4">
                    <h3>{output.displayName}</h3>
                    <pre className="mt-3 max-h-[360px] overflow-auto whitespace-pre-wrap rounded-md bg-stone-50 p-4 text-xs leading-relaxed text-neutral-700">
                      {safeJson(output.content)}
                    </pre>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <FieldSelect label="Main diagnosis" value={review.diagnosisCorrect} options={correctnessOptions} onChange={(value) => updateAi(output.id, "diagnosisCorrect", value)} />
                      <FieldSelect label="Hearing interpretation" value={review.hearingCorrect} options={correctnessOptions} onChange={(value) => updateAi(output.id, "hearingCorrect", value)} />
                      <FieldSelect label="Safety concern" value={review.safetyConcern} options={yesNoOptions} onChange={(value) => updateAi(output.id, "safetyConcern", value)} />
                      <RatingField label="Evidence quality 1-5" value={review.evidenceQuality} onChange={(value) => updateAi(output.id, "evidenceQuality", value)} />
                      <RatingField label="Management quality 1-5" value={review.managementQuality} onChange={(value) => updateAi(output.id, "managementQuality", value)} />
                      <RatingField label="Confidence appropriate 1-5" value={review.confidenceAppropriate} onChange={(value) => updateAi(output.id, "confidenceAppropriate", value)} />
                      <div className="md:col-span-3">
                        <TextField label="AI output comments" value={review.comments} onChange={(value) => updateAi(output.id, "comments", value)} rows={3} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-4 text-sm text-neutral-600">No AI diagnostic outputs included in this package yet.</p>
          )}
        </section>

        <section className={`surface p-5 md:p-6 ${activeReview.goldLocked ? "" : "opacity-60"}`}>
          <p className="kicker">Step 3</p>
          <h2 className="mt-2 text-2xl">Patient explanation review</h2>
          <div className="mt-5 space-y-5">
            {activeCase.patientTextOutputs?.map((output) => {
              const review = activeReview.patientText[output.id] || clonePatient();
              return (
                <div key={output.id} className="rounded-lg border border-stone-200 bg-white p-4">
                  <h3>{output.displayName}</h3>
                  <pre className="mt-3 max-h-[300px] overflow-auto whitespace-pre-wrap rounded-md bg-stone-50 p-4 text-sm leading-relaxed text-neutral-700">
                    {output.text}
                  </pre>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <RatingField label="Medical accuracy 1-5" value={review.medicalAccuracy} onChange={(value) => updatePatient("patientText", output.id, "medicalAccuracy", value)} />
                    <RatingField label="Clarity 1-5" value={review.clarity} onChange={(value) => updatePatient("patientText", output.id, "clarity", value)} />
                    <RatingField label="Actionability 1-5" value={review.actionability} onChange={(value) => updatePatient("patientText", output.id, "actionability", value)} />
                    <RatingField label="Reassurance 1-5" value={review.reassurance} onChange={(value) => updatePatient("patientText", output.id, "reassurance", value)} />
                    <FieldSelect label="Misleading risk" value={review.misleadingRisk} options={yesNoOptions} onChange={(value) => updatePatient("patientText", output.id, "misleadingRisk", value)} />
                    <div className="md:col-span-3">
                      <TextField label="Patient text comments" value={review.comments} onChange={(value) => updatePatient("patientText", output.id, "comments", value)} rows={3} />
                    </div>
                  </div>
                </div>
              );
            })}

            {activeCase.patientImageOutputs?.map((output) => {
              const review = activeReview.patientImage[output.id] || clonePatient();
              return (
                <div key={output.id} className="rounded-lg border border-stone-200 bg-white p-4">
                  <h3>{output.displayName}</h3>
                  <img src={output.dataUrl} alt={output.displayName} className="mt-3 max-h-[520px] rounded-md border border-stone-200 bg-white object-contain" />
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <RatingField label="Medical accuracy 1-5" value={review.medicalAccuracy} onChange={(value) => updatePatient("patientImage", output.id, "medicalAccuracy", value)} />
                    <RatingField label="Clarity 1-5" value={review.clarity} onChange={(value) => updatePatient("patientImage", output.id, "clarity", value)} />
                    <RatingField label="Actionability 1-5" value={review.actionability} onChange={(value) => updatePatient("patientImage", output.id, "actionability", value)} />
                    <RatingField label="Reassurance 1-5" value={review.reassurance} onChange={(value) => updatePatient("patientImage", output.id, "reassurance", value)} />
                    <FieldSelect label="Misleading risk" value={review.misleadingRisk} options={yesNoOptions} onChange={(value) => updatePatient("patientImage", output.id, "misleadingRisk", value)} />
                    <div className="md:col-span-3">
                      <TextField label="Patient image comments" value={review.comments} onChange={(value) => updatePatient("patientImage", output.id, "comments", value)} rows={3} />
                    </div>
                  </div>
                </div>
              );
            })}

            {!activeCase.patientTextOutputs?.length && !activeCase.patientImageOutputs?.length ? (
              <p className="rounded-md border border-stone-200 bg-stone-50 p-4 text-sm text-neutral-600">No patient explanation outputs included in this package yet.</p>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
