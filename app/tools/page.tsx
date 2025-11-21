export default function Tools() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="mb-4 text-slate-900">Research Tools</h1>
      <p className="text-xl text-slate-600 mb-12">Interactive tools for hearing assessment and research</p>
      
      <div className="space-y-6">
        <div className="p-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mt-0 mb-2 text-slate-900">integrated Digit-in-Noise Test</h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Comprehensive hearing and cognitive screening tool with volume calibration, device check, and adaptive SNR testing in your browser.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <a 
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200" 
              href="/tools/digit-in-noise-test/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Launch the test
            </a>
            <a 
              className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200" 
              href="/publications/" 
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Read publications
            </a>
          </div>
        </div>

        <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50 opacity-75 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-300 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mt-0 mb-2 text-slate-500">Online Questionnaire</h2>
              <p className="text-slate-500 mb-3">
                Embed Wenjuanxing or Qualtrics for recruitment and follow-ups.
              </p>
              <span className="inline-block px-3 py-1 bg-slate-200 text-slate-600 text-sm font-medium rounded-full">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
