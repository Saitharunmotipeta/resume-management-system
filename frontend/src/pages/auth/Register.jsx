import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Register () {
  const { register, loading, error } = useAuth()
  const [form, setForm] = useState({ username: '', password: '', role: 'student' })
  const navigate = useNavigate()

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      navigate('/')
    } catch {}
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">Register</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label className="label">Username</label>
            <input name="username" className="input" value={form.username} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" className="input" value={form.password} onChange={onChange} required />
          </div>
          <div>
            <label className="label">Role</label>
            <select name="role" className="input" value={form.role} onChange={onChange}>
              <option value="student">Student</option>
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="btn w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
      </div>
    </div>
  )
}
