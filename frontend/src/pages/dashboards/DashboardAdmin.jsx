import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Settings, Briefcase } from "lucide-react";

export default function DashboardAdmin() {
  const cards = [
    {
      icon: <BarChart3 className="w-10 h-10 text-indigo-600 mb-4" />,
      title: "Metrics",
      desc: "View real-time platform statistics including user signups, job postings, resumes, and interview trends.",
      link: "/admin/metrics",
      btn: "View Metrics",
    },
    {
      icon: <Settings className="w-10 h-10 text-green-600 mb-4" />,
      title: "Manage",
      desc: "Access the admin console to manage users, oversee job postings, review resumes, and monitor platform activity.",
      link: "/admin/manage",
      btn: "Open Console",
    },
    {
      icon: <Briefcase className="w-10 h-10 text-yellow-500 mb-4" />,
      title: "Jobs",
      desc: "Browse and monitor all job postings on the platform. Useful for quick reviews and quality checks.",
      link: "/jobs",
      btn: "Browse Jobs",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-10">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          👋 Welcome, Admin!
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Here's what's happening on your platform today. Use the tools below to
          manage everything with ease.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              {card.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600 mb-6">{card.desc}</p>
              <Link
                to={card.link}
                className="mt-auto inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition"
              >
                {card.btn}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-sm text-gray-500">
        ⓘ Admin Dashboard • Built for control and clarity
      </div>
    </div>
  );
}
