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

  // ✅ Normalize error for safe display
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
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">Login</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="label">Username</label>
            <input
              className="input"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{renderError(error)}</div>}

          <button className="btn w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-sm mt-3">
          No account?{' '}
          <Link to="/register" className="link">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
