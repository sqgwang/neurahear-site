export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl mb-6">HK Audiology Group</h1>
        <p className="text-xl text-gray-600 mb-8">
          Welcome to the <strong className="text-blue-700">HK Audiology Group</strong>
        </p>
        <div className="flex justify-center gap-4">
          <a href="/teams/" className="btn">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Meet Our Team
          </a>
          <a href="/tools/" className="btn-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Try Our Tools
          </a>
        </div>
      </div>

      {/* Mission Card */}
      <div className="grid md:grid-cols-1 gap-6">
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <h2 className="relative z-10">Our Mission</h2>
          <p className="mt-4 text-lg relative z-10">
            To investigate the auditory system and enhance hearing healthcare services for everyone through 
            <strong className="text-blue-700"> innovative research</strong>, 
            <strong className="text-blue-700"> cutting-edge technology</strong>, and 
            <strong className="text-blue-700"> interdisciplinary collaboration</strong>.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="text-center p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="mb-2">Research</h3>
          <p className="text-sm text-gray-600">Advancing hearing cognitive science</p>
        </div>

        <div className="text-center p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="mb-2">Innovation</h3>
          <p className="text-sm text-gray-600">Developing clinical tools & solutions</p>
        </div>

        <div className="text-center p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="mb-2">Collaboration</h3>
          <p className="text-sm text-gray-600">Building global partnerships</p>
        </div>
      </div>
    </div>
  );
}
