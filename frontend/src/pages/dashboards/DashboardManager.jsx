import React from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export default function DashboardManager() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-10">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          👨‍💼 Welcome, Manager
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Stay on top of your hiring process — track, review, and manage candidates efficiently, while making data-driven decisions.
        </p>
      </div>

      {/* Shortlisted Candidates Card */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-10 h-10 text-purple-600" />
              <h3 className="font-semibold text-lg text-gray-800">
                Shortlisted Candidates
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Review and manage candidates shortlisted by HR. Track progress, schedule interviews, and ensure top talent is prioritized.
            </p>
          </div>
          <Link
            to="/manager/shortlisted"
            className="mt-6 inline-block w-full text-center font-medium py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
          >
            View Shortlisted
          </Link>
        </div>

        {/* Static Info Section (Wikipedia-style) */}
        <div className="bg-white p-6 rounded-2xl shadow-md text-gray-700 text-sm leading-relaxed">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            About This Dashboard
          </h3>
          <p>
            The Manager Dashboard is a central interface designed to streamline hiring operations. It serves as a hub for decision-makers to monitor progress, review candidates, and collaborate with HR teams. With a focus on efficiency and insights, this tool helps ensure hiring strategies align with organizational goals.
          </p>
          <p className="mt-2">
            By highlighting shortlisted candidates and offering structured tools for evaluation, the dashboard empowers managers to make informed choices that contribute to building high-performing teams.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-sm text-gray-500">
        ⓘ Manager Dashboard • Empower your decisions with insights, structure, and efficiency
      </div>
    </div>
  );
}
