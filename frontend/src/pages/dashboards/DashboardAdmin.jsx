import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardAdmin () {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Metrics</h3>
        <p className="text-sm text-gray-600">Platform-level KPIs.</p>
        <Link className="btn mt-2" to="/admin/metrics">View Metrics</Link>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Manage</h3>
        <p className="text-sm text-gray-600">Jobs, resumes, users.</p>
        <Link className="btn mt-2" to="/admin/manage">Open Console</Link>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Jobs</h3>
        <p className="text-sm text-gray-600">Quick link to jobs list.</p>
        <Link className="btn mt-2" to="/jobs">Browse Jobs</Link>
      </div>
    </div>
  )
}
