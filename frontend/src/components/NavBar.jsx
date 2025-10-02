import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Home } from 'lucide-react'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleHomeClick = () => {
    if (!user) return navigate('/jobs')
    switch (user.role) {
      case 'student':
        navigate('/student')
        break
      case 'hr':
        navigate('/hr')
        break
      case 'manager':
        navigate('/manager')
        break
      case 'admin':
        navigate('/admin')
        break
      default:
        navigate('/jobs')
    }
  }

  return (
    <nav className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto p-3 flex items-center justify-between">
        {/* Title */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold tracking-wide text-blue-700 flex items-center gap-2"
        >
          HireWise
        </Link>

        {/* Home Icon */}
        {user && (
          <button
            onClick={handleHomeClick}
            className="flex items-center gap-1 text-blue-700 hover:text-blue-800 transition-colors duration-200"
            title="Home"
          >
            <Home className="w-5 h-5" />
            <span className="hidden md:inline font-bold">Home</span>
          </button>
        )}

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link className="link" to="/login">Login</Link>
              <Link className="link" to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-500">
                Hi, {user.username} ({user.role})
              </span>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
