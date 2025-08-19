import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardManager () {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Shortlisted Candidates</h3>
        <p className="text-sm text-gray-600">Managers can see only shortlisted candidates.</p>
        <Link className="btn mt-2" to="/manager/shortlisted">View Shortlisted</Link>
      </div>
    </div>
  )
}
