import ExpertReviewTool from "./ExpertReviewTool";

export const metadata = {
  title: "Expert Review Console | HK Audiology Group",
  description: "Browser-based expert review workflow for deidentified AI hearing-clinic pilot cases.",
};

export default function ExpertReviewPage() {
  return (
    <div className="space-y-8">
      <section className="max-w-4xl">
        <div className="eyebrow">Restricted research workflow</div>
        <h1>Expert Review Console</h1>
        <p className="mt-5 text-lg text-neutral-700">
          Upload the deidentified review package, complete each case in order, and export the completed review file.
          The case package stays in this browser session; the public webpage does not store study data.
        </p>
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          Use only with deidentified research packets. Lock the independent clinical judgment before viewing AI outputs.
        </div>
      </section>

      <ExpertReviewTool />
    </div>
  );
}
