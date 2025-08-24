import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import JobsList from './pages/jobs/JobsList.jsx'
import JobDetail from './pages/jobs/JobDetail.jsx'
import UploadResume from './pages/resume/UploadResume.jsx'
import MyResumes from './pages/resume/MyResumes.jsx'
import DashboardStudent from './pages/dashboards/DashboardStudent.jsx'
import DashboardHR from './pages/dashboards/DashboardHR.jsx'
import DashboardManager from './pages/dashboards/DashboardManager.jsx'
import DashboardAdmin from './pages/dashboards/DashboardAdmin.jsx'
import PostJob from './pages/hr/PostJob.jsx'
import Applicants from './pages/hr/Applicants.jsx'
import Shortlist from './pages/hr/Shortlist.jsx'
import Shortlisted from './pages/manager/Shortlisted.jsx'
import AdminMetrics from './pages/admin/AdminMetrics.jsx'
import AdminManage from './pages/admin/AdminManage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import JobResumes from './pages/jobs/JobResumes.jsx'

// 🔹 NEW: Student Applications page
import MyApplications from './pages/student/MyApplications.jsx'

// Simple fallback pages
const UnauthorizedPage = () => (
  <div className="card text-red-500">
    <h2 className="text-xl font-bold">🚫 Unauthorized</h2>
    <p>You do not have permission to access this page.</p>
  </div>
)

const NotFoundPage = () => (
  <div className="card">
    <h2 className="text-xl font-bold">404 - Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
)

export default function App() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobsList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Student routes */}
          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route path="/student" element={<DashboardStudent />} />
            <Route path="/resume/upload" element={<UploadResume />} />
            <Route path="/resumes/mine" element={<MyResumes />} />
            {/* 🔹 New route */}
            <Route path="/student/applications" element={<MyApplications />} />
          </Route>

          {/* HR routes */}
          <Route element={<ProtectedRoute roles={['hr']} />}>
            <Route path="/hr" element={<DashboardHR />} />
            <Route path="/hr/jobs/new" element={<PostJob />} />
            <Route path="/hr/jobs/:id/applicants" element={<Applicants />} />
            <Route path="/hr/shortlist" element={<Shortlist />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/jobs/:id/resumes" element={<JobResumes />} />

          </Route>

          {/* Manager routes */}
          <Route element={<ProtectedRoute roles={['manager']} />}>
            <Route path="/manager" element={<DashboardManager />} />
            <Route path="/manager/shortlisted" element={<Shortlisted />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/metrics" element={<AdminMetrics />} />
            <Route path="/admin/manage" element={<AdminManage />} />
          </Route>

          {/* Fallback routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  )
}
