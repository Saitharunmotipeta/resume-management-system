import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Register() {
  const { register, loading, error } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student'
  })
  const navigate = useNavigate()

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      navigate('/')
    } catch {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-gray-300 shadow-xl bg-white transition">

        {/* Left Side - Register Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create Your Account</h1>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="student">Student</option>
                <option value="hr">HR</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-600 text-sm">
                {Array.isArray(error)
                  ? error.map((err, idx) => <div key={idx}>{err.msg}</div>)
                  : (error.msg || String(error))}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow transition"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Right Side - Welcome Description */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 to-pink-600 text-white p-10">
          <h2 className="text-4xl font-bold mb-4">Join Us 🚀</h2>
          <p className="text-base text-center max-w-sm leading-relaxed">
            Create your account to access personalized dashboards, manage candidates, and be part of a smarter hiring experience.
          </p>
        </div>
      </div>
    </div>
  )
}
