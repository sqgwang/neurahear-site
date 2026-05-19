import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { members, slugify } from '@/data/team'
import { notFound } from 'next/navigation'
import { createPageMetadata } from '@/app/data/site'

export async function generateStaticParams() {
  return members
    .filter(m => !m.externalLink)  // Only generate pages for internal profiles
    .map((m) => ({ slug: m.slug ?? slugify(m.name) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const member = members.find((m) => (m.slug ?? slugify(m.name)) === resolvedParams.slug);

  if (!member || member.externalLink) {
    return createPageMetadata({
      title: "Team Member",
      description: "HK Audiology Group team member profile.",
      path: `/teams/${resolvedParams.slug}/`,
    });
  }

  return createPageMetadata({
    title: member.name,
    description: `${member.name}${member.title ? `, ${member.title}` : ""}${member.affiliation ? ` at ${member.affiliation}` : ""}. HK Audiology Group team profile.`,
    path: `/teams/${resolvedParams.slug}/`,
  });
}

export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const member = members.find((m) => (m.slug ?? slugify(m.name)) === resolvedParams.slug)
  
  if (!member || member.externalLink) return notFound()

  // Shang Wang's detailed personal page
  if (resolvedParams.slug === 'shang-wang') {
    return (
      <div className="max-w-5xl mx-auto">
        {/* Header with photo */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 p-8 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-200 shadow-lg relative overflow-hidden">
          
          <div className="relative">
            <Image
              src="/images/teams/shang_wang.jpg"
              alt="Shang Wang"
              width={256}
              height={256}
              priority
              className="h-64 w-64 rounded-lg object-cover shadow-xl ring-4 ring-white"
            />
          </div>
          <div className="flex-1 relative z-10">
            <h1 className="text-5xl mb-3 font-bold text-slate-900">Shang Wang</h1>
            <p className="text-xl text-blue-600 font-bold mb-2 uppercase tracking-wide">Post-doctoral Fellow</p>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
              Human Communication, Learning, and Development Unit<br />
              The University of Hong Kong
            </p>
            
            {/* Social Links with Icons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:sqgw@connect.hku.hk"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition text-sm font-medium shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email
              </a>
              
              {member.googleScholar && (
                <a
                  href={member.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition text-sm font-medium shadow-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                  </svg>
                  Google Scholar
                </a>
              )}
              
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#006396] transition text-sm font-medium shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Table of Contents Navigation */}
        <nav className="mb-12 p-4 bg-white rounded-lg border border-slate-200 shadow-sm sticky top-4 z-50 backdrop-blur-md bg-white/90">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <a href="#about" className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-sm font-bold">
              About
            </a>
            <a href="#research" className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-sm font-bold">
              Research & Work
            </a>
            <a href="#background" className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-sm font-bold">
              Background
            </a>
            <a href="#news" className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-sm font-bold">
              News
            </a>
          </div>
        </nav>

        {/* About */}
        <section id="about" className="mb-12 scroll-mt-24 p-8 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-100 flex items-center gap-3 text-slate-900">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            About
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-slate-700">
            Hi, I am a Post-doctoral Fellow at the <a href="https://web.edu.hku.hk/unit/human-communication-learning-and-development" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium border-b border-blue-200 hover:border-blue-500 transition-colors">Human Communication, Learning, and Development Unit</a>, the University of Hong Kong. 
            My research focuses on <strong className="text-slate-900">hearing cognitive science</strong>, <strong className="text-slate-900">tele-audiology</strong>, and <strong className="text-slate-900">speech perception in noise</strong>, aiming to advance 
            clinical audiology through innovative technology and interdisciplinary collaboration.
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            PhD in Hearing Science with over 10 years of experience in audiology research and clinical practice. Specializes in 
            developing innovative tools for hearing and cognitive screening, including the integrated Digit-in-Noise Test. Committed 
            to advancing clinical audiology through interdisciplinary collaboration and technology-driven solutions.
          </p>
        </section>

        {/* Research and Work */}
        <section id="research" className="mb-12 scroll-mt-24 p-8 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-100 flex items-center gap-3 text-slate-900">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            Research and Work
          </h2>
          <p className="text-lg leading-relaxed text-slate-700">
            With a PhD in Hearing Science and over a decade of experience in audiology research and clinical practice, I specialize 
            in developing tools for hearing and cognitive screening. My current research explores the potential of the <strong className="text-slate-900">integrated 
            Digit-in-Noise (iDIN) test</strong> to assess both hearing and cognitive functions, with the goal of refining testing formats 
            for broader clinical and research applications. I am also investigating <strong className="text-slate-900">AI-driven solutions</strong>, including large language 
            model-based chatbots, to enhance hearing care services and to develop multidimensional approaches for evaluating the 
            impact of hearing loss on everyday functioning. As a next-generation audiologist in China, I am dedicated to advancing 
            the professionalization of audiology and improving hearing care accessibility.
          </p>
        </section>

        {/* Background */}
        <section id="background" className="mb-12 scroll-mt-24 p-8 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-100 flex items-center gap-3 text-slate-900">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            Background
          </h2>
          <p className="text-lg leading-relaxed text-slate-700">
            I received my Ph.D. in Hearing Science from the <a href="https://www.hku.hk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium border-b border-blue-200 hover:border-blue-500 transition-colors">University of Hong Kong</a>, an MSc in Clinical Audiology from the <a href="https://www.southampton.ac.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium border-b border-blue-200 hover:border-blue-500 transition-colors">University 
            of Southampton</a>, and a BSc in Audiology from <a href="https://www.zcmu.edu.cn/english/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium border-b border-blue-200 hover:border-blue-500 transition-colors">Zhejiang Chinese Medical University</a>. During my BSc and MSc studies, I received 
            training as an audiologist and worked as a clinical audiologist in Singapore and Beijing for several years after graduating 
            from my MSc. During my Ph.D. studies, I spent half a year as a visiting student at the <a href="https://www.deephearinglab.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium border-b border-blue-200 hover:border-blue-500 transition-colors">Deep Hearing Lab</a> in the MRC Cognition 
            and Brain Sciences Unit at the University of Cambridge.
          </p>
        </section>

        {/* News */}
        <section id="news" className="mb-12 scroll-mt-24 p-8 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-200 flex items-center gap-3 text-slate-900">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            News 
          </h2>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <span className="font-bold text-blue-600 min-w-[120px] text-sm uppercase tracking-wider pt-1">July 2025</span>
              <p className="text-lg text-slate-700">Joined the Executive Board of the <a href="https://computationalaudiology.com/about/#ExecutiveBoard" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold hover:text-blue-600 transition-colors">Computational Audiology Network (CAN)</a>.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <span className="font-bold text-blue-600 min-w-[120px] text-sm uppercase tracking-wider pt-1">June 2025</span>
              <p className="text-lg text-slate-700">
                Participated in The Johns Hopkins Cochlear Center Fellows Program in Aging, Hearing, and Public Health, hosted by 
                Shanghai Ninth People&apos;s Hospital at Shanghai Jiao Tong University School of Medicine, Shanghai, China.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <span className="font-bold text-blue-600 min-w-[120px] text-sm uppercase tracking-wider pt-1">May 2025</span>
              <p className="text-lg text-slate-700">
                Successfully hosted the <a href="https://sites.google.com/view/hkasm2025/home" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-bold hover:text-blue-600 transition-colors">Hong Kong Auditory Science Meeting (HKASM) 2025 </a> at The University of Hong Kong. My heartfelt 
                thanks to all speakers and participants.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/teams" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to team
          </Link>
        </div>
      </div>
    )
  }

  // Dicky Mo's detailed personal page
  if (resolvedParams.slug === 'dicky-mo') {
    return (
      <div className="max-w-5xl mx-auto">
        {/* Header with photo */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 p-8 bg-gradient-to-br from-slate-50 to-white rounded-lg border border-slate-200 shadow-lg relative overflow-hidden">
          
          <div className="relative">
            <Image
              src="/images/teams/dicky_mo.jpg"
              alt="Dicky Mo"
              width={256}
              height={256}
              priority
              className="h-64 w-64 rounded-lg object-cover shadow-xl ring-4 ring-white"
            />
          </div>
          <div className="flex-1 relative z-10">
            <h1 className="text-5xl mb-3 font-bold text-slate-900">Dicky Mo</h1>
            <p className="text-xl text-blue-600 font-bold mb-2 uppercase tracking-wide">Audiology Researcher</p>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
              Orka Labs
            </p>
            
            {/* Social Links with Icons */}
            <div className="flex flex-wrap gap-3">
              {member.googleScholar && (
                <a
                  href={member.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition text-sm font-medium shadow-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                  </svg>
                  Google Scholar
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Table of Contents Navigation */}
        <nav className="mb-12 p-4 bg-white rounded-lg border border-slate-200 shadow-sm sticky top-4 z-50 backdrop-blur-md bg-white/90">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <a href="#about" className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-sm font-bold">
              About
            </a>
            <a href="#research" className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-sm font-bold">
              Research
            </a>
            <a href="#background" className="px-4 py-2 rounded-md text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-sm font-bold">
              Background
            </a>
          </div>
        </nav>

        {/* About */}
        <section id="about" className="mb-12 scroll-mt-24 p-8 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-100 flex items-center gap-3 text-slate-900">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            About Me
          </h2>
          <p className="text-lg leading-relaxed mb-4 text-slate-700">
            I am an audiology researcher at Orka Labs, where my work bridges the gap between artificial intelligence and clinical audiology. My research focuses on three core areas: developing and evaluating large language model (LLM) applications for audiological practice, assessing AI-driven clinical decision support systems, and advancing methodologies for both subjective and objective hearing aid evaluation.
          </p>
        </section>

        {/* Research */}
        <section id="research" className="mb-12 scroll-mt-24 p-8 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-100 flex items-center gap-3 text-slate-900">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            Current Research
          </h2>
          <p className="text-lg leading-relaxed text-slate-700">
            My current research investigates the integration of AI technologies into audiological practice. I develop and evaluate LLM-based tools for clinical audiology, exploring how these technologies can enhance diagnostic accuracy and clinical decision-making. Additionally, I work on comprehensive evaluation frameworks for AI applications in hearing healthcare, examining both their clinical validity and practical utility in real-world settings.
          </p>
        </section>

        {/* Background */}
        <section id="background" className="mb-12 scroll-mt-24 p-8 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-100 flex items-center gap-3 text-slate-900">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            Background
          </h2>
          <p className="text-lg leading-relaxed mb-4 text-slate-700">
            I hold a PhD in Auditory Science from the Faculty of Education at the University of Hong Kong, and earned my BSc in Audiology from Hallym University in South Korea. I am a licensed audiologist in South Korea and conducted postdoctoral research in the Department of Otorhinolaryngology, Head and Neck Surgery at the Chinese University of Hong Kong.
          </p>
          <p className="text-lg leading-relaxed text-slate-700">
            As someone with bilateral severe hearing loss and extensive personal experience as a hearing aid user, I bring both professional expertise and lived experience to my research, informing a more nuanced and patient-centered approach to audiology innovation.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/teams" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to team
          </Link>
        </div>
      </div>
    )
  }

  // Default page for other members
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{member.name}</h1>
      {member.title && <p className="text-xl text-gray-600 mb-2">{member.title}</p>}
      {member.affiliation && <p className="text-lg text-gray-700 mb-6">{member.affiliation}</p>}
      {member.email && (
        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
          {member.email}
        </a>
      )}
      <div className="mt-8">
        <Link href="/teams" className="text-blue-600 hover:underline">← Back to team</Link>
      </div>
    </div>
  )
}
