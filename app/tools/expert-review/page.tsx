import ExpertReviewTool from "./ExpertReviewTool";
import { createPageMetadata } from "../../data/site";

export const metadata = {
  ...createPageMetadata({
    title: "Expert Review Console",
    description: "Browser-based expert review workflow for deidentified PTA and tympanometry LLM research packets.",
    path: "/tools/expert-review/",
  }),
  robots: {
    index: false,
    follow: false,
  },
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
          Use only with deidentified research packets. Review the PTA and tympanometry images first, then lock the
          independent judgment before viewing routine clinician or AI outputs.
        </div>
      </section>

      <ExpertReviewTool />
    </div>
  );
}
