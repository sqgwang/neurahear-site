export default function Tools() {
  return (
    <div>
      <h1>Tools</h1>
      <div className="card mt-6">
        <h2 className="text-xl">Digit-in-Noise Test (beta)</h2>
        <p className="mt-2">Volume calibration, device check and adaptive SNR in browser.</p>
        <p className="mt-2">
          <a 
            className="link-button" 
            href="/tools/digit-in-noise-test/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Launch Digit-in-Noise Test
          </a>
        </p>
      </div>
      <div className="card mt-4">
        <h2 className="text-xl">Online Questionnaire</h2>
        <p className="mt-2">Embed Wenjuanxing or Qualtrics for recruitment and follow-ups.</p>
      </div>
    </div>
  );
}
