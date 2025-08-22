import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardHR () {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {/* Post a Job */}
      <div className="card">
        <h3 className="font-semibold mb-2">Post a Job</h3>
        <p className="text-sm text-gray-600">Create a new opening.</p>
        <Link className="btn mt-2" to="/hr/jobs/new">Create Job</Link>
      </div>

      {/* View Applicants */}
      <div className="card">
        <h3 className="font-semibold mb-2">Applicants</h3>
        <p className="text-sm text-gray-600">View applicants per job and manage shortlisting.</p>
        <Link className="btn mt-2" to="/jobs">Pick a Job</Link>
      </div>

      {/* View Shortlist */}
      <div className="card">
        <h3 className="font-semibold mb-2">Shortlist</h3>
        <p className="text-sm text-gray-600">Review shortlisted candidates.</p>
        <Link className="btn mt-2" to="/hr/shortlist">View Shortlist</Link>
      </div>

      {/* Analyse Resumes */}
      <div className="card">
        <h3 className="font-semibold mb-2">Analyse Resumes</h3>
        <p className="text-sm text-gray-600">
          Run analysis for all applicants of a job in one click.
        </p>
        <Link className="btn mt-2" to="/jobs">Pick a Job</Link>
      </div>
    </div>
  )
}
