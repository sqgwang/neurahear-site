import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>HK Audiology Group</h1>
      <p className="mt-4">We study hearing and audiology..188888.</p>
      <div className="mt-6 flex gap-4">
        <Link href="/projects/" className="btn">Explore Projects</Link>
        <Link href="/publications/" className="btn bg-white text-black border">Publications</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="card">
          <h2>Our Mission</h2>
          <p className="mt-2">Advance hearing science and make hearing care more accessible through evidence-based research and digital innovation.</p>
        </div>
        <div className="card">
          <h2>Focus</h2>
          <p className="mt-2">Speech-in-noise perception</p>
        </div>
        <div className="card">
          <h2>Join Us</h2>
          <p className="mt-2">We welcome collaborations across audiology, psychology and engineering.</p>
        </div>
      </div>
    </div>
  );
}
