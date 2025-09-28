import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { Link } from 'react-router-dom'
import { BarChart3, Settings, Briefcase } from 'lucide-react'

export default function AdminManage() {
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      const { data } = await api.get('/jobs')
      setJobs(data)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to load jobs')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const del = async (id) => {
    try {
      await api.delete(`/jobs/${id}`)
      await load()
    } catch (e) {
      setError(e?.response?.data?.detail || 'Delete failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg px-6 py-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">Admin Panel</h2>
        <nav className="flex flex-col space-y-6 text-gray-700 font-medium">
          <Link to="/admin/metrics" className="flex items-center gap-2 hover:text-indigo-600">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Metrics
          </Link>
          <Link to="/admin/manage" className="flex items-center gap-2 hover:text-green-600">
            <Settings className="w-5 h-5 text-green-500" />
            Manage
          </Link>
          <Link to="/jobs" className="flex items-center gap-2 hover:text-yellow-600">
            <Briefcase className="w-5 h-5 text-yellow-500" />
            Jobs
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">🛠️ Manage Job Postings</h1>

        {error && (
          <div className="bg-white p-4 rounded-lg shadow-md text-red-600 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row md:items-center justify-between"
            >
              <div className="mb-2 md:mb-0">
                <div className="text-lg font-semibold text-gray-800">{j.title}</div>
                <div className="text-sm text-gray-500">ID: {j.id} • Vacancies: {j.vacancies}</div>
              </div>
              <button
                className="mt-2 md:mt-0 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                onClick={() => del(j.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="mt-6 text-center bg-white p-6 rounded-lg shadow">
            No jobs found.
          </div>
        )}
      </main>
    </div>
  )
}
