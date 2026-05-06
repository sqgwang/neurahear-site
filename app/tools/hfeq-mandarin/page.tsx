import HfeqMandarinTool from "./HfeqMandarinTool";

export const metadata = {
  title: "HFEQ-Mandarin Research Preview | HK Audiology Group",
  description: "Research-preview Mandarin questionnaire workflow for hearing and functioning in everyday life.",
};

export default function HfeqMandarinPage() {
  return (
    <div className="space-y-10">
      <section className="max-w-4xl">
        <div className="eyebrow">Everyday Functioning PROM</div>
        <h1>HFEQ-Mandarin Research Preview</h1>
        <p className="mt-5 text-lg text-neutral-700">
          A browser-based research preview of the Mandarin Hearing and Functioning in Everyday Life Questionnaire.
          It captures hearing-related everyday functioning across hearing, communication, participation, personal resources,
          societal support, and health.
        </p>
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          This tool is for research and validation workflow development only. It is not a clinical diagnosis, and the final
          scoring model may change after multicenter validation and refinement.
        </div>
      </section>

      <HfeqMandarinTool />
    </div>
  );
}
