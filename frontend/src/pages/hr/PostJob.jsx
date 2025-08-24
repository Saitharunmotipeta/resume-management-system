import React, { useState } from "react"
import api from "../../api/axios"

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    vacancies: 1,
    expires_at: "",
  })
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)
    setError(null)
    try {
      const payload = { ...form, vacancies: Number(form.vacancies) }
      const { data } = await api.post("/jobs", payload)
      setStatus(`✅ Job created with ID ${data.id}`)
      setForm({ title: "", description: "", vacancies: 1, expires_at: "" })
    } catch (e) {
      setError(e?.response?.data?.detail || "❌ Failed to create job")
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create a New Job
        </h1>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              name="title"
              value={form.title}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="6"
              name="description"
              value={form.description}
              onChange={onChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vacancies
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="number"
                name="vacancies"
                value={form.vacancies}
                onChange={onChange}
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date (ISO)
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                name="expires_at"
                value={form.expires_at}
                onChange={onChange}
                placeholder="2025-09-01T23:59:00"
              />
            </div>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition"
            type="submit"
          >
            Create Job
          </button>
        </form>

        {status && (
          <div className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            {status}
          </div>
        )}
        {error && (
          <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
