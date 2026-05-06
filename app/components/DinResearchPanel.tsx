import Link from "next/link";

const waveformBars = [24, 44, 68, 36, 82, 52, 30, 74, 48, 88, 58, 34, 64, 46, 76, 40, 70, 54, 28, 62, 84, 38, 56, 72];

const protocolSteps = [
  { label: "Setup", value: "Device check", state: "Complete" },
  { label: "Adaptive DIN", value: "SNR ladder", state: "Live" },
  { label: "Optimization", value: "PI function", state: "Analysis" },
];

const snrSteps = ["+2", "0", "-2", "-4", "-6", "-8", "-10"];

const languageTracks = [
  "Mandarin",
  "Cantonese",
  "Taiwanese",
  "American English",
  "British English",
  "Fuzhouese",
  "Ningboese",
  "Hangzhouese",
  "Min",
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function DinResearchPanel() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_18px_60px_rgba(23,23,23,0.08)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-600 via-sky-500 to-amber-500" />
      <div className="grid gap-0 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="bg-neutral-950 p-5 text-white sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-teal-200">Digit-in-noise research stack</p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Speech-in-noise tools built for real studies</h2>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-stone-100">
              Live
            </span>
          </div>

          <div
            role="img"
            aria-label="Speech waveform embedded in a noise floor"
            className="mt-7 rounded-lg border border-white/10 bg-white/[0.04] p-4"
          >
            <div className="flex h-32 items-end gap-1.5">
              {waveformBars.map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  className={`flex-1 rounded-t-sm ${index % 5 === 0 ? "bg-amber-300" : index % 3 === 0 ? "bg-sky-300" : "bg-teal-300"}`}
                  style={{ height: `${height}%`, opacity: 0.42 + (height / 100) * 0.5 }}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-xs text-stone-300">
              <span>noise calibrated</span>
              <span className="h-px flex-1 bg-white/10" />
              <span>digits normalized</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {protocolSteps.map((step) => (
              <div key={step.label} className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                <div className="text-xs font-semibold uppercase text-stone-400">{step.label}</div>
                <div className="mt-2 text-sm font-semibold text-white">{step.value}</div>
                <div className="mt-2 text-xs text-teal-200">{step.state}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500">Current trial</p>
                <div className="mt-2 flex gap-2">
                  {["4", "9", "1"].map((digit) => (
                    <span key={digit} className="flex h-12 w-12 items-center justify-center rounded-md bg-neutral-950 text-xl font-semibold text-white shadow-sm">
                      {digit}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase text-neutral-500">SNR</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-950">-6 dB</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase text-neutral-500">
                <span>Adaptive track</span>
                <span>response locked</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {snrSteps.map((step, index) => (
                  <div key={step} className="min-w-0">
                    <div
                      className={`h-2 rounded-full ${index < 4 ? "bg-teal-600" : index === 4 ? "bg-amber-500" : "bg-stone-300"}`}
                    />
                    <div className="mt-1 truncate text-center text-[11px] font-medium text-neutral-500">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500">Audio languages</p>
                <p className="mt-1 text-sm text-neutral-600">Nine tracks prepared for DIN and optimization workflows.</p>
              </div>
              <span className="text-3xl font-semibold text-neutral-950">9</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {languageTracks.map((language) => (
                <span key={language} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                  {language}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/tools/digit-in-noise-test/" className="btn">
              DIN test
              <ArrowIcon />
            </Link>
            <Link href="/tools/single-digit-in-noise-test/" className="btn-secondary">
              Optimization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
