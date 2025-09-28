import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, Star, FileSearch } from "lucide-react";

export default function DashboardHR() {
  const cards = [
    {
      title: "Post a Job",
      desc: "Easily create and publish new job openings to attract candidates.",
      link: "/hr/jobs/new",
      btn: "Create Job",
      icon: <Briefcase className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Applicants",
      desc: "Browse and manage applicants for each job. Track application status and initiate next steps.",
      link: "/jobs",
      btn: "View Applicants",
      icon: <Users className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Shortlist",
      desc: "Review and refine your shortlist of candidates. Mark top talent and prepare for interviews.",
      link: "/hr/shortlist",
      btn: "View Shortlist",
      icon: <Star className="w-10 h-10 text-indigo-600" />,
    },
    {
      title: "Analyse Resumes",
      desc: "Run automated AI-powered analysis on applicant resumes to identify the best matches.",
      link: "/jobs",
      btn: "Analyse Now",
      icon: <FileSearch className="w-10 h-10 text-indigo-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-10">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          👩‍💼 Welcome, HR Partner
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Streamline your hiring workflow — from job posting to applicant analysis, all in one place.
        </p>
      </div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              className="mt-6 inline-block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              {c.btn}
            </Link>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-sm text-gray-500">
        ⓘ HR Dashboard • Designed to simplify hiring decisions
      </div>
    </div>
  );
}
