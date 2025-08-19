import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function MyResumes () {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/resumes/my')
        setItems(data)
      } catch (e) {
        setError(e?.response?.data?.detail || 'Failed to load resumes')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="card">Loading...</div>
  if (error) return <div className="card text-red-600">{error}</div>

  return (
    <div className="space-y-3">
      {items.map(r => (
        <div key={r.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Resume #{r.id} • Job {r.job_id}</div>
              <div className="text-xs text-gray-500">Match: {r.match_score ?? 'N/A'}</div>
            </div>
            <div className={"px-2 py-1 rounded-xl text-white " + (r.shortlisted === 'yes' ? 'bg-green-600' : 'bg-gray-400')}>
              {r.shortlisted === 'yes' ? 'Shortlisted' : 'Pending'}
            </div>
          </div>
          {r.match_points && (
            <details className="mt-2">
              <summary className="cursor-pointer">Details</summary>
              <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(r.match_points, null, 2)}</pre>
            </details>
          )}
        </div>
      ))}
      {items.length === 0 && <div className="card">No resumes uploaded yet.</div>}
    </div>
  )
}
