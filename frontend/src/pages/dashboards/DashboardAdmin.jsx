import React from "react"
import { Link } from "react-router-dom"
import { BarChart3, Settings, Briefcase } from "lucide-react"

export default function DashboardAdmin() {
  const cards = [
    {
      icon: <BarChart3 className="w-8 h-8 text-indigo-600 mb-3" />,
      title: "Metrics",
      desc: "View real-time platform statistics including user signups, job postings, resumes, and interview trends.",
      link: "/admin/metrics",
      btn: "View Metrics",
    },
    {
      icon: <Settings className="w-8 h-8 text-green-600 mb-3" />,
      title: "Manage",
      desc: "Access the admin console to manage users, oversee job postings, review resumes, and monitor platform activity.",
      link: "/admin/manage",
      btn: "Open Console",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-yellow-500 mb-3" />,
      title: "Jobs",
      desc: "Browse and monitor all job postings on the platform. Useful for quick reviews and quality checks.",
      link: "/jobs",
      btn: "Browse Jobs",
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6 p-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="card flex flex-col justify-between p-6 shadow-lg rounded-2xl hover:shadow-xl transition bg-white"
        >
          <div>
            {card.icon}
            <h3 className="text-xl font-bold mb-2">{card.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
          </div>
          <Link
            to={card.link}
            className="mt-6 inline-block w-full text-center bg-indigo-600 text-white font-medium py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
          >
            {card.btn}
          </Link>
        </div>
      ))}
    </div>
  )
}
