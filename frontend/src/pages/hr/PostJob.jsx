import React, { useState } from 'react'
import api from '../../api/axios'

export default function PostJob () {
  const [form, setForm] = useState({ title: '', description: '', vacancies: 1, expires_at: '' })
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus(null); setError(null)
    try {
      const payload = { ...form, vacancies: Number(form.vacancies) }
      const { data } = await api.post('/jobs', payload)
      setStatus(`Job created with id ${data.id}`)
      setForm({ title: '', description: '', vacancies: 1, expires_at: '' })
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to create job')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">Create Job</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div><label className="label">Title</label><input className="input" name="title" value={form.title} onChange={onChange} required /></div>
          <div><label className="label">Description</label><textarea className="input" rows="6" name="description" value={form.description} onChange={onChange} required /></div>
          <div><label className="label">Vacancies</label><input className="input" type="number" name="vacancies" value={form.vacancies} onChange={onChange} min="1" required /></div>
          <div><label className="label">Expires At (ISO)</label><input className="input" name="expires_at" value={form.expires_at} onChange={onChange} placeholder="2025-09-01T23:59:00" /></div>
          <button className="btn">Create</button>
        </form>
        {status && <div className="text-green-700 mt-2">{status}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>
    </div>
  )
}
