import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const RoleLinks = () => {
  const { user } = useAuth()
  if (!user) return null
  const r = user.role
  return (
    <div className="flex gap-3 items-center">
      {r === 'student' && <Link className="link" to="/student">Student</Link>}
      {r === 'hr' && <Link className="link" to="/hr">HR</Link>}
      {r === 'manager' && <Link className="link" to="/manager">Manager</Link>}
      {r === 'admin' && <Link className="link" to="/admin">Admin</Link>}
      <span className="text-xs text-gray-400">|</span>
      <Link className="link" to="/jobs">Jobs</Link>
    </div>
  )
}

export default function NavBar () {
  const { user, logout } = useAuth()
  return (
    <nav className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto p-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-blue-700">HireWise</Link>
        <RoleLinks />
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link className="link" to="/login">Login</Link>
              <Link className="link" to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-500">Hi, {user.username} ({user.role})</span>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
