import Link from 'next/link';

export default function Projects() {
  const projects = [
    {
      title: "Digital Hearing and Cognitive Screening and Assessment",
      icon: "🔬",
      color: "blue",
      link: "#"
    },
    {
      title: "Evaluating the Impact of Hearing Loss on Everyday Functioning",
      icon: "👂",
      color: "purple",
      link: "#"
    },
    {
      title: "AI and Audiology",
      icon: "🤖",
      color: "green",
      link: "#"
    },
    {
      title: "Hearing Healthcare and Hearing Care Professionals in China",
      icon: "🏥",
      color: "blue",
      link: "/projects/hearing-healthcare-china"
    }
  ];

  const colorClasses = {
    blue: "border-slate-200 bg-white hover:border-blue-300 hover:shadow-blue-500/5",
    purple: "border-slate-200 bg-white hover:border-purple-300 hover:shadow-purple-500/5",
    green: "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-emerald-500/5"
  };

  const iconBgClasses = {
    blue: "bg-blue-50",
    purple: "bg-purple-50",
    green: "bg-emerald-50"
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-4 text-slate-900">Research Projects</h1>
      <p className="text-xl text-slate-600 mb-12">Exploring innovative approaches to hearing science and audiology</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <Link 
            href={project.link}
            key={index}
            className={`card border ${colorClasses[project.color as keyof typeof colorClasses]} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer block group rounded-2xl p-8`}
          >
            <div className="flex items-start gap-6">
              <div className={`text-4xl p-4 rounded-2xl ${iconBgClasses[project.color as keyof typeof iconBgClasses]} group-hover:scale-110 transition-transform duration-300`}>{project.icon}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2 mt-0 text-slate-900 group-hover:text-blue-600 transition-colors">{project.title}</h2>
                <div className="flex items-center text-sm font-medium text-slate-400 group-hover:text-blue-500 transition-colors mt-4">
                  Learn more 
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
