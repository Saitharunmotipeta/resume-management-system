import React from "react"
import { Link } from "react-router-dom"
import { Briefcase, Users, Star, FileSearch } from "lucide-react" // ✅ icons

export default function DashboardHR() {
  const cards = [
    {
      title: "Post a Job",
      desc: "Easily create and publish new job openings to attract candidates.",
      link: "/hr/jobs/new",
      btn: "Create Job",
      icon: <Briefcase className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Applicants",
      desc: "Browse and manage applicants for each job. Track application status and initiate next steps.",
      link: "/jobs",
      btn: "View Applicants",
      icon: <Users className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Shortlist",
      desc: "Review and refine your shortlist of candidates. Mark top talent and prepare for interviews.",
      link: "/hr/shortlist",
      btn: "View Shortlist",
      icon: <Star className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Analyse Resumes",
      desc: "Run automated AI-powered analysis on applicant resumes to identify the best matches.",
      link: "/jobs",
      btn: "Analyse Now",
      icon: <FileSearch className="w-8 h-8 text-indigo-600" />,
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {cards.map((c, i) => (
        <div
          key={i}
          className="card p-5 shadow-lg rounded-2xl flex flex-col justify-between hover:shadow-xl transition"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              {c.icon}
              <h3 className="font-semibold text-lg">{c.title}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
          </div>
          <Link
            to={c.link}
            className="btn mt-6 w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            {c.btn}
          </Link>
        </div>
      ))}
    </div>
  )
}
