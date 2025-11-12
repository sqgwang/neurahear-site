export default function Tools() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="mb-4">Research Tools</h1>
      <p className="text-xl text-gray-600 mb-12">Interactive tools for hearing assessment and research</p>
      
      <div className="space-y-6">
        <div className="card border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mt-0 mb-2">integrated Digit-in-Noise Test</h2>
              <p className="text-gray-700 mb-4">
                Comprehensive hearing and cognitive screening tool with volume calibration, device check, and adaptive SNR testing in your browser.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <a 
              className="btn" 
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
              className="btn-secondary" 
              href="/publications/" 
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Read publications
            </a>
          </div>
        </div>

        <div className="card bg-gray-50 opacity-75">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mt-0 mb-2 text-gray-600">Online Questionnaire</h2>
              <p className="text-gray-500">
                Embed Wenjuanxing or Qualtrics for recruitment and follow-ups.
              </p>
              <span className="inline-block mt-3 px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
