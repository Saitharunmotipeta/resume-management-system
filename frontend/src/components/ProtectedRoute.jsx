import React, { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ roles, fallback }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  // 🔐 Auto logout if token expired
  useEffect(() => {
    if (user?.token) {
      try {
        const decoded = jwtDecode(user.token)
        if (decoded.exp * 1000 < Date.now()) {
          logout()
        }
      } catch {
        logout()
      }
    }
  }, [user, logout])

  // 🚪 Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 👮 Role-based access
  if (roles && !roles.includes(user.role)) {
    return fallback || <Navigate to="/unauthorized" replace />
  }

  // ✅ Authorized
  return <Outlet />
}
