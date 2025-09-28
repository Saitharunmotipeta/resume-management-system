import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, FileText, ClipboardList } from "lucide-react";

export default function DashboardStudent() {
  const cards = [
    {
      icon: <Briefcase className="w-10 h-10 text-blue-600" />,
      title: "Discover Jobs",
      desc: "🚀 Boost your career! Explore tailored opportunities, challenge yourself, and land your dream role.",
      link: "/jobs",
      btn: "Browse Jobs",
      btnColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: <FileText className="w-10 h-10 text-green-600" />,
      title: "Enhance Your Resume",
      desc: "💡 Stand out! Upload resumes, get instant AI-driven feedback, and sharpen your professional profile.",
      link: "/resume/upload",
      btn: "Upload Resume",
      btnColor: "bg-green-600 hover:bg-green-700",
    },
    {
      icon: <ClipboardList className="w-10 h-10 text-purple-600" />,
      title: "Track Applications",
      desc: "📈 Stay ahead! Monitor your applications, follow up on interviews, and showcase your skills effectively.",
      link: "/student/applications",
      btn: "View Applications",
      btnColor: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-10">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          🎓 Welcome, Future Achiever!
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Take charge of your career journey. Explore jobs, improve your resume, and track your applications—all in one empowering dashboard.
        </p>
      </div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                {c.icon}
                <h3 className="font-semibold text-lg text-gray-800">{c.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{c.desc}</p>
            </div>
            <Link
              to={c.link}
              className={`mt-6 inline-block w-full text-center text-white font-medium py-2 px-4 rounded-lg ${c.btnColor}`}
            >
              {c.btn}
            </Link>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-sm text-gray-500">
        ⓘ Student Dashboard • Unlock your potential and take your skills to the next level
      </div>
    </div>
  );
}
