import Link from 'next/link'
import { members, slugify } from '@/data/team'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return members
    .filter(m => !m.externalLink)  // Only generate pages for internal profiles
    .map((m) => ({ slug: m.slug ?? slugify(m.name) }))
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
        <div className="flex flex-col md:flex-row gap-8 mb-12 p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-200 shadow-lg">
          <div className="relative">
            <img
              src="/images/teams/shang_wang.jpg"
              alt="Shang Wang"
              className="w-64 h-64 rounded-2xl object-cover shadow-xl"
            />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-5xl mb-3">Shang Wang</h1>
            <p className="text-xl text-blue-700 font-semibold mb-2">Post-doctoral Fellow</p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Human Communication, Learning, and Development Unit<br />
              The University of Hong Kong
            </p>
            
            {/* Social Links with Icons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:sqgw@connect.hku.hk"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition text-sm"
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
        <nav className="mb-12 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-200 shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Quick Navigation
          </h3>
          <div className="flex flex-wrap gap-3">
            <a href="#about" className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 text-sm font-medium">
              📖 About
            </a>
            <a href="#research" className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 text-sm font-medium">
              🔬 Research & Work
            </a>
            <a href="#background" className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 text-sm font-medium">
              🎓 Background
            </a>
            <a href="#news" className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 text-sm font-medium">
              📢 News
            </a>
          </div>
        </nav>

        {/* About */}
        <section id="about" className="mb-12 scroll-mt-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold mb-4 pb-2 border-b-2 border-blue-300">About</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hi, I am a Post-doctoral Fellow at the <a href="https://web.edu.hku.hk/unit/human-communication-learning-and-development" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Human Communication, Learning, and Development Unit</a>, the University of Hong Kong. 
            My research focuses on <strong>hearing cognitive science</strong>, <strong>tele-audiology</strong>, and <strong>speech perception in noise</strong>, aiming to advance 
            clinical audiology through innovative technology and interdisciplinary collaboration.
          </p>
          <p className="text-lg leading-relaxed">
            PhD in Hearing Science with over 10 years of experience in audiology research and clinical practice. Specializes in 
            developing innovative tools for hearing and cognitive screening, including the integrated Digit-in-Noise Test. Committed 
            to advancing clinical audiology through interdisciplinary collaboration and technology-driven solutions.
          </p>
        </section>

        {/* Research and Work */}
        <section id="research" className="mb-12 scroll-mt-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold mb-4 pb-2 border-b-2 border-blue-300">Research and Work</h2>
          <p className="text-lg leading-relaxed">
            With a PhD in Hearing Science and over a decade of experience in audiology research and clinical practice, I specialize 
            in developing tools for hearing and cognitive screening. My current research explores the potential of the <strong>integrated 
            Digit-in-Noise (iDIN) test</strong> to assess both hearing and cognitive functions, with the goal of refining testing formats 
            for broader clinical and research applications. I am also investigating <strong>AI-driven solutions</strong>, including large language 
            model-based chatbots, to enhance hearing care services and to develop multidimensional approaches for evaluating the 
            impact of hearing loss on everyday functioning. As a next-generation audiologist in China, I am dedicated to advancing 
            the professionalization of audiology and improving hearing care accessibility.
          </p>
        </section>

        {/* Background */}
        <section id="background" className="mb-12 scroll-mt-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold mb-4 pb-2 border-b-2 border-blue-300">Background</h2>
          <p className="text-lg leading-relaxed">
            I received my Ph.D. in Hearing Science from the <a href="https://www.hku.hk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">University of Hong Kong</a>, an MSc in Clinical Audiology from the <a href="https://www.southampton.ac.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">University 
            of Southampton</a>, and a BSc in Audiology from <a href="https://www.zcmu.edu.cn/english/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Zhejiang Chinese Medical University</a>. During my BSc and MSc studies, I received 
            training as an audiologist and worked as a clinical audiologist in Singapore and Beijing for several years after graduating 
            from my MSc. During my Ph.D. studies, I spent half a year as a visiting student at the <a href="https://www.deephearinglab.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Deep Hearing Lab</a> in the MRC Cognition 
            and Brain Sciences Unit at the University of Cambridge.
          </p>
        </section>

        {/* News */}
        <section id="news" className="mb-12 scroll-mt-6 p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200 shadow-sm">
          <h2 className="text-3xl font-bold mb-4 pb-2 border-b-2 border-amber-300 flex items-center gap-2">
            News 
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FCD34D"/>
              <path d="M12 8V12L15 15" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2"/>
            </svg>
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="font-semibold text-gray-700 min-w-[120px]">July 2025</span>
              <p className="text-lg">Joined the Executive Board of the <a href="https://computationalaudiology.com/about/#ExecutiveBoard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"><strong>Computational Audiology Network (CAN)</strong>.</a></p>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold text-gray-700 min-w-[120px]">June 2025</span>
              <p className="text-lg">
                Participated in The Johns Hopkins Cochlear Center Fellows Program in Aging, Hearing, and Public Health, hosted by 
                Shanghai Ninth People's Hospital at Shanghai Jiao Tong University School of Medicine, Shanghai, China.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold text-gray-700 min-w-[120px]">May 2025</span>
              <p className="text-lg">
                Successfully hosted the <a href="https://sites.google.com/view/hkasm2025/home" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"><strong>Hong Kong Auditory Science Meeting (HKASM) 2025 </strong></a> at The University of Hong Kong. My heartfelt 
                thanks to all speakers and participants.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <Link href="/teams" className="text-blue-600 hover:underline">← Back to team</Link>
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
