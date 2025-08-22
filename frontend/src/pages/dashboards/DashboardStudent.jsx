import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardStudent () {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* 🔹 Find Jobs */}
      <div className="card">
        <h3 className="font-semibold mb-2">Find Jobs</h3>
        <p className="text-sm text-gray-600">Explore and apply to open positions.</p>
        <Link className="btn mt-2" to="/jobs">Browse Jobs</Link>
      </div>

      {/* 🔹 Manage Resumes */}
      <div className="card">
        <h3 className="font-semibold mb-2">Your Resumes</h3>
        <p className="text-sm text-gray-600">Upload and track resume analysis results.</p>
        <div className="flex gap-2 mt-2">
          <Link className="btn" to="/resume/upload">Upload Resume</Link>
          <Link className="btn bg-slate-600 hover:bg-slate-700" to="/resumes/mine">View Uploads</Link>
        </div>
      </div>

      {/* 🔹 My Applications */}
      <div className="card">
        <h3 className="font-semibold mb-2">My Applications</h3>
        <p className="text-sm text-gray-600">
          Track jobs you applied for and see interview schedule.
        </p>
        <Link className="btn mt-2" to="/student/applications">View Applications</Link>
      </div>
    </div>
  )
}
