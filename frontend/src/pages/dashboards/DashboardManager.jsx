import React from "react"
import { Link } from "react-router-dom"
import { Users } from "lucide-react"

export default function DashboardManager() {
  const cards = [
    {
      icon: <Users className="w-8 h-8 text-purple-600 mb-3" />,
      title: "Shortlisted Candidates",
      desc: "Access and review candidates who have been shortlisted by HR. Track progress and prepare for interview rounds.",
      link: "/manager/shortlisted",
      btn: "View Shortlisted",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {cards.map((c, i) => (
        <div
          key={i}
          className="card p-5 shadow-lg rounded-2xl flex flex-col justify-between hover:shadow-xl transition bg-white"
        >
          <div>
            {c.icon}
            <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
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
