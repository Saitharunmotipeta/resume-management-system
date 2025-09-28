import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const { login, error, loading } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(username, password)
      navigate(from, { replace: true })
    } catch {
      /* error is handled in AuthContext */
    }
  }

  const renderError = (err) => {
    if (!err) return null
    if (Array.isArray(err)) {
      return err.map((e, i) => <div key={i}>{e.msg || e}</div>)
    }
    if (typeof err === 'object') {
      return err.msg || JSON.stringify(err)
    }
    return String(err)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-gray-300 shadow-xl bg-white transition">

        {/* Left Side - Welcome Section */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 to-pink-600 text-white p-10">
          <h2 className="text-4xl font-bold mb-4">Welcome Back 👋</h2>
          <p className="text-base text-center max-w-sm leading-relaxed">
            Sign in to manage your dashboard, view candidates, and streamline your hiring workflow.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Login</h1>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {error && <div className="text-red-600 text-sm">{renderError(error)}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow transition"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-sm mt-6 text-gray-600 text-center">
            No account?{' '}
            <Link to="/register" className="text-purple-600 hover:underline font-medium">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
