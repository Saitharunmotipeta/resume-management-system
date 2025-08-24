import React from "react"
import { Link } from "react-router-dom"
import { Briefcase, FileText, ClipboardList } from "lucide-react"

export default function DashboardStudent() {
  const cardStyles =
    "card bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-transform duration-200 ease-in-out hover:scale-[1.02]"

  const btnBase =
    "btn px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 focus:outline-none"

  const primaryBtn = `${btnBase} bg-blue-600 text-white hover:bg-blue-700`
  const secondaryBtn = `${btnBase} bg-gray-200 hover:bg-gray-300`

  const cards = [
    {
      icon: <Briefcase className="w-8 h-8 text-blue-600 mb-3" />,
      title: "Find Jobs",
      desc: "Discover and apply to the latest job opportunities tailored to your profile and career preferences.",
      buttons: [{ text: "Browse Jobs", to: "/jobs", type: "primary" }],
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600 mb-3" />,
      title: "Your Resumes",
      desc: "Upload and manage multiple resumes. Get instant AI feedback to make your resume stand out.",
      buttons: [
        { text: "Upload Resume", to: "/resume/upload", type: "secondary" },
        { text: "View Uploads", to: "/resumes/mine", type: "primary" },
      ],
    },
    {
      icon: <ClipboardList className="w-8 h-8 text-purple-600 mb-3" />,
      title: "My Applications",
      desc: "Track all your job applications, monitor statuses, and stay updated on upcoming interviews.",
      buttons: [
        { text: "View Applications", to: "/student/applications", type: "primary" },
      ],
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {cards.map((c, i) => (
        <div key={i} className={cardStyles}>
          <div>
            {c.icon}
            <h3 className="text-lg font-semibold mb-3">{c.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {c.buttons.map((btn, idx) => (
              <Link
                key={idx}
                to={btn.to}
                className={btn.type === "primary" ? primaryBtn : secondaryBtn}
              >
                {btn.text}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
