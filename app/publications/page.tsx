type ProfileKey = "Shang" | "Dicky";

type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: number;
  citations: number;
  profiles: ProfileKey[];
  url?: string;
};

const scholarProfiles: Array<{
  key: ProfileKey;
  name: string;
  role: string;
  citations: number;
  listed: number;
  url: string;
}> = [
  {
    key: "Shang",
    name: "Shangqiguo Wang",
    role: "Post-doctoral Fellow, University of Hong Kong",
    citations: 123,
    listed: 18,
    url: "https://scholar.google.com/citations?user=V9WkSfkAAAAJ&hl=en",
  },
  {
    key: "Dicky",
    name: "Changgeng Mo",
    role: "Orka Labs Inc",
    citations: 37,
    listed: 12,
    url: "https://scholar.google.com/citations?user=R_Gt36wAAAAJ&hl=en",
  },
];

const publications: Publication[] = [
  {
    title: "Perspectives of audiologists in China on artificial intelligence in clinical practice and professional identity: a qualitative study",
    authors: "S Wang, K Mou, J Wang, C Mo, X Shen, J Wang, W Zuo, Y Chen",
    venue: "BMC Medical Education",
    year: 2026,
    citations: 0,
    profiles: ["Shang", "Dicky"],
  },
  {
    title: "Effects of second language exposure on the integrated digits-in-noise test in Cantonese non-native speakers with normal hearing",
    authors: "S Wang, LLN Wong, A Li",
    venue: "International Journal of Audiology, 1-13",
    year: 2026,
    citations: 0,
    profiles: ["Shang"],
  },
  {
    title: "Now Is the Era When Everyone Can Easily Measure and Monitor Hearing",
    authors: "S Wang, HE Cullington, NS Reed",
    venue: "The Hearing Journal 79(2), 1-3",
    year: 2026,
    citations: 0,
    profiles: ["Shang"],
  },
  {
    title: "Evaluation of AI chatbots in hearing health: model timeliness and prompt design matter",
    authors: "S Wang, C Mo",
    venue: "International Journal of Audiology, 1-4",
    year: 2026,
    citations: 0,
    profiles: ["Shang"],
  },
  {
    title: "Reference-aware SFM layers for intrusive intelligibility prediction",
    authors: "H Yu, H Zhou, B Cao, C Mo, L Li, SX Wang",
    venue: "ICASSP 2026 - IEEE International Conference on Acoustics, Speech and Signal Processing",
    year: 2026,
    citations: 0,
    profiles: ["Dicky"],
  },
  {
    title: "Leveraging multiple speech enhancers for non-intrusive intelligibility prediction for hearing-impaired listeners",
    authors: "B Cao, L Li, H Yu, C Mo, H Zhou, SX Wang",
    venue: "ICASSP 2026 - IEEE International Conference on Acoustics, Speech and Signal Processing",
    year: 2026,
    citations: 0,
    profiles: ["Dicky"],
  },
  {
    title: "Integrated digit in noise test (iDIN) for rapid hearing and cognitive screening: a preliminary exploration",
    authors: "S Wang, LLN Wong, TY Pan",
    venue: "Age and Ageing 54(1), afaf009",
    year: 2025,
    citations: 4,
    profiles: ["Shang"],
    url: "https://doi.org/10.1093/ageing/afaf009",
  },
  {
    title: "The effect of dialect and accent on digit perception in noise in young listeners with normal hearing",
    authors: "S Wang, LLN Wong, X Shen",
    venue: "Journal of Speech, Language, and Hearing Research 68(5), 2584-2596",
    year: 2025,
    citations: 3,
    profiles: ["Shang"],
    url: "https://doi.org/10.1044/2025_JSLHR-24-00472",
  },
  {
    title: "Evaluating psychometric properties of the Cantonese integrated Digit-in-Noise Test: perhaps the 2-digit sequence can also be used for hearing screening",
    authors: "LLN Wong, S Wang, AIC Ieong, CMY Man, TY Pan",
    venue: "International Journal of Audiology 64(9), 952-957",
    year: 2025,
    citations: 1,
    profiles: ["Shang"],
    url: "https://doi.org/10.1080/14992027.2024.2424877",
  },
  {
    title: "Effects of speaker voice and digit optimization on the recognition of digits in noise by normal hearing and cochlear implant listeners",
    authors: "T Goehring, TN Dang, C Gaultier, S Wang",
    venue: "OSF",
    year: 2025,
    citations: 1,
    profiles: ["Shang"],
    url: "https://osf.io/preprints/osf/r4ejx_v1",
  },
  {
    title: "Integrated Digit-in-Noise Test: A Rapid Screening Tool for Hearing and Cognitive Function",
    authors: "L Wong, J Tung, S Wang",
    venue: "Innovation in Aging 9(Supplement_2), igaf122.4334",
    year: 2025,
    citations: 0,
    profiles: ["Shang"],
  },
  {
    title: "Exploring the potential of using the integrated Digit-in-Noise Test as a measure of speech recognition in older hearing aid users",
    authors: "S Wang, LLN Wong",
    venue: "American Journal of Audiology 34(3), 581-594",
    year: 2025,
    citations: 0,
    profiles: ["Shang"],
    url: "https://doi.org/10.1044/2025_AJA-24-00264",
  },
  {
    title: "Unveiling the best practices for applying speech foundation models to speech intelligibility prediction for hearing-impaired people",
    authors: "H Zhou, B Cao, C Mo, L Li, SX Wang",
    venue: "2025 IEEE Workshop on Applications of Signal Processing to Audio and Acoustics",
    year: 2025,
    citations: 6,
    profiles: ["Dicky"],
  },
  {
    title: "Intrusive Intelligibility Prediction with ASR Encoders",
    authors: "H Yu, H Zhou, B Cao, C Mo, L Li, SX Wang",
    venue: "Clarity-2025: The 6th Clarity Workshop on Improving Speech-in-Noise",
    year: 2025,
    citations: 2,
    profiles: ["Dicky"],
  },
  {
    title: "No audiogram: Leveraging existing scores for personalized speech intelligibility prediction",
    authors: "H Zhou, C Mo, B Cao, L Li, SX Wang",
    venue: "arXiv preprint arXiv:2506.02039",
    year: 2025,
    citations: 1,
    profiles: ["Dicky"],
  },
  {
    title: "AECRN: A Unified Neural-Network for Improving Hearing Aid Speech Enhancement",
    authors: "B Cao, L Li, C Mo, H Zhou, SX Wang",
    venue: "2025 IEEE Workshop on Signal Processing Systems (SiPS), 1-5",
    year: 2025,
    citations: 0,
    profiles: ["Dicky"],
  },
  {
    title: "Exploring the performance of ChatGPT-4 in the Taiwan audiologist qualification examination: preliminary observational study highlighting the potential of AI chatbots in hearing care",
    authors: "S Wang, C Mo, Y Chen, X Dai, H Wang, X Shen",
    venue: "JMIR Medical Education 10(1), e55595",
    year: 2024,
    citations: 21,
    profiles: ["Shang", "Dicky"],
    url: "https://doi.org/10.2196/55595",
  },
  {
    title: "Development of the Mandarin digit-in-noise test and examination of the effect of the number of digits used in the test",
    authors: "S Wang, LLN Wong",
    venue: "Ear and Hearing 45(3), 572-582",
    year: 2024,
    citations: 17,
    profiles: ["Shang"],
    url: "https://doi.org/10.1097/AUD.0000000000001447",
  },
  {
    title: "An exploration of the memory performance in older adult hearing aid users on the integrated digit-in-noise test",
    authors: "S Wang, LLN Wong",
    venue: "Trends in Hearing 28, 23312165241253653",
    year: 2024,
    citations: 6,
    profiles: ["Shang"],
    url: "https://doi.org/10.1177/23312165241253653",
  },
  {
    title: "Development of the Mandarin reading span test and confirmation of its relationship with speech perception in noise",
    authors: "S Wang, LLN Wong, Y Chen",
    venue: "International Journal of Audiology 63(12), 1009-1018",
    year: 2024,
    citations: 4,
    profiles: ["Shang"],
    url: "https://doi.org/10.1080/14992027.2024.2305685",
  },
  {
    title: "Recommendations for expanding the clinical role of audiologists in hospitals in Mainland China: insights from a survey-based study",
    authors: "S Wang, C Mo, C Zhao, X Shen, Y Chen",
    venue: "Perspectives of the ASHA Special Interest Groups 9(4), 1033-1038",
    year: 2024,
    citations: 2,
    profiles: ["Shang", "Dicky"],
    url: "https://doi.org/10.1044/2024_PERSP-24-00080",
  },
  {
    title: "ABO blood group and cochlear function: evidence from a large sample size study",
    authors: "C Mo, TF Ma, B McPherson",
    venue: "International Journal of Audiology 63(2), 106-116",
    year: 2024,
    citations: 3,
    profiles: ["Dicky"],
  },
  {
    title: "Development and validation of a Mandarin digit-in-noise test for screening hearing and cognitive function",
    authors: "S Wang",
    venue: "HKU Theses Online (HKUTO)",
    year: 2023,
    citations: 1,
    profiles: ["Shang"],
    url: "https://hub.hku.hk/handle/10722/341541",
  },
  {
    title: "Cochlear function in individuals with and without spontaneous otoacoustic emissions",
    authors: "C Mo, B McPherson, TF Ma",
    venue: "Audiology Research 13(5), 686-699",
    year: 2023,
    citations: 2,
    profiles: ["Dicky"],
  },
  {
    title: "ABO blood group: Does it impact on auditory function?",
    authors: "B McPherson, C Mo",
    venue: "Journal of Hearing Science 12(1)",
    year: 2022,
    citations: 0,
    profiles: ["Dicky"],
  },
  {
    title: "Can dual compression offer better Mandarin speech intelligibility and sound quality than fast-acting compression?",
    authors: "Y Chen, LLN Wong, V Kuehnel, J Qian, SC Voss, W Shangqiguo",
    venue: "Trends in Hearing 25, 2331216521997610",
    year: 2021,
    citations: 21,
    profiles: ["Shang"],
    url: "https://doi.org/10.1177/2331216521997610",
  },
  {
    title: "Auditory inspired machine learning techniques can improve speech intelligibility and quality for hearing-impaired listeners",
    authors: "JJM Monaghan, T Goehring, X Yang, F Bolner, S Wang, M Wright, MCM Wright, S Bleeck",
    venue: "The Journal of the Acoustical Society of America 141(3), 1985-1998",
    year: 2017,
    citations: 42,
    profiles: ["Shang"],
    url: "https://doi.org/10.1121/1.4977197",
  },
];

const profileStyles: Record<ProfileKey, string> = {
  Shang: "border-teal-200 bg-teal-50 text-teal-800",
  Dicky: "border-amber-200 bg-amber-50 text-amber-800",
};

function AuthorText({ authors }: { authors: string }) {
  const parts = authors.split(/(\bS Wang\b|\bW Shangqiguo\b|\bC Mo\b)/g);

  return (
    <>
      {parts.map((part, index) =>
        /\b(S Wang|W Shangqiguo|C Mo)\b/.test(part) ? (
          <strong key={`${part}-${index}`} className="font-semibold text-neutral-950">
            {part}
          </strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

export default function Publications() {
  const years = Array.from(new Set(publications.map((publication) => publication.year))).sort((a, b) => b - a);
  const citationTotal = publications.reduce((sum, publication) => sum + publication.citations, 0);
  const recentCount = publications.filter((publication) => publication.year >= 2025).length;

  return (
    <div className="space-y-12">
      <section className="max-w-4xl">
        <div className="eyebrow">Updated from Google Scholar / May 5, 2026</div>
        <h1>Publications</h1>
        <p className="mt-5 max-w-3xl text-lg text-neutral-700">
          A refreshed publication record combining Scholar-indexed work from Shangqiguo Wang and Changgeng Mo.
          Citation counts are shown as they appeared on the linked profiles at update time.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="surface p-5">
          <div className="text-3xl font-semibold text-neutral-950">{publications.length}</div>
          <div className="mt-1 text-sm text-neutral-500">Unique publication entries</div>
        </div>
        <div className="surface p-5">
          <div className="text-3xl font-semibold text-neutral-950">{recentCount}</div>
          <div className="mt-1 text-sm text-neutral-500">Entries from 2025 onward</div>
        </div>
        <div className="surface p-5">
          <div className="text-3xl font-semibold text-neutral-950">{citationTotal}</div>
          <div className="mt-1 text-sm text-neutral-500">Citations across listed entries</div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          {scholarProfiles.map((profile) => (
            <a
              key={profile.key}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="surface block p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_16px_40px_rgba(23,23,23,0.08)]"
            >
              <div className={`mb-4 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${profileStyles[profile.key]}`}>
                Google Scholar
              </div>
              <h2 className="text-xl">{profile.name}</h2>
              <p className="mt-2 text-sm text-neutral-500">{profile.role}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-semibold text-neutral-950">{profile.citations}</div>
                  <div className="text-neutral-500">Cited by</div>
                </div>
                <div>
                  <div className="font-semibold text-neutral-950">{profile.listed}</div>
                  <div className="text-neutral-500">Profile items</div>
                </div>
              </div>
            </a>
          ))}
        </aside>

        <div className="space-y-10">
          {years.map((year) => {
            const entries = publications.filter((publication) => publication.year === year);

            return (
              <section key={year} className="space-y-4">
                <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-3">
                  <h2 className="text-3xl">{year}</h2>
                  <p className="text-sm text-neutral-500">{entries.length} entries</p>
                </div>

                <ol className="space-y-3">
                  {entries.map((publication) => (
                    <li key={`${publication.year}-${publication.title}`} className="surface p-5 transition-all duration-300 hover:border-stone-300 hover:bg-white">
                      <article>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          {publication.profiles.map((profileKey) => (
                            <span key={profileKey} className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${profileStyles[profileKey]}`}>
                              {profileKey === "Shang" ? "Shang" : "Dicky"}
                            </span>
                          ))}
                          {publication.citations > 0 ? (
                            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                              {publication.citations} citations
                            </span>
                          ) : (
                            <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-500">
                              New / no citations yet
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg leading-snug">
                          {publication.url ? (
                            <a href={publication.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-primary">
                              {publication.title}
                            </a>
                          ) : (
                            publication.title
                          )}
                        </h3>
                        <p className="mt-3 text-sm text-neutral-600">
                          <AuthorText authors={publication.authors} />
                        </p>
                        <p className="mt-2 text-sm font-medium text-neutral-500">{publication.venue}</p>
                      </article>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
