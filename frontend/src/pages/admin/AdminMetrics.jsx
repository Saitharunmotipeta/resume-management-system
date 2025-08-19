import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

export default function AdminMetrics () {
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/metrics')
        setMetrics(data)
      } catch (e) {
        setError(e?.response?.data?.detail || 'Metrics endpoint not available')
      }
    })()
  }, [])

  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-2">Platform Metrics</h1>
      {error && <div className="text-red-600">{error}</div>}
      {metrics ? <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(metrics, null, 2)}</pre> : <div>Loading...</div>}
    </div>
  )
}
