export default function Projects() {
  const projects = [
    {
      title: "Digital Hearing and Cognitive Screening and Assessment",
      icon: "🔬",
      color: "blue"
    },
    {
      title: "Evaluating the Impact of Hearing Loss on Everyday Functioning",
      icon: "👂",
      color: "purple"
    },
    {
      title: "AI and Audiology",
      icon: "🤖",
      color: "green"
    },
    {
      title: "Hearing Healthcare and Hearing Care Professionals in China",
      icon: "🏥",
      color: "amber"
    }
  ];

  const colorClasses = {
    blue: "border-blue-300 bg-blue-50 hover:bg-blue-100",
    purple: "border-purple-300 bg-purple-50 hover:bg-purple-100",
    green: "border-green-300 bg-green-50 hover:bg-green-100",
    amber: "border-amber-300 bg-amber-50 hover:bg-amber-100"
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="mb-4">Research Projects</h1>
      <p className="text-xl text-gray-600 mb-12">Exploring innovative approaches to hearing science and audiology</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div 
            key={index}
            className={`card border-2 ${colorClasses[project.color as keyof typeof colorClasses]} transition-all duration-300 hover:scale-105 cursor-pointer`}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{project.icon}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-0 mt-0">{project.title}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
