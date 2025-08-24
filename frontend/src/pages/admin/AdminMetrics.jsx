import React, { useEffect, useState } from "react"
import api from "../../api/axios"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AdminMetrics() {
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/admin/metrics")
        setMetrics(data)
      } catch (e) {
        setError(e?.response?.data?.detail || "Metrics endpoint not available")
      }
    })()
  }, [])

  if (error) {
    return (
      <div className="card text-center">
        <h1 className="text-xl font-semibold mb-2">Platform Metrics</h1>
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  if (!metrics) {
    return <div className="text-center p-4">Loading metrics...</div>
  }

  // Example data transformation
  const usersData = [
    { name: "Users", value: metrics.users || 0 },
    { name: "Jobs", value: metrics.jobs || 0 },
    { name: "Resumes", value: metrics.resumes || 0 },
    { name: "Interviews", value: metrics.interviews || 0 },
  ]

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"]

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      {/* Card 1: Overview Stats */}
      <div className="card p-4 shadow-lg rounded-2xl hover:shadow-xl transition">
        <h2 className="text-lg font-bold mb-4">Overview</h2>
        <ul className="space-y-2 text-gray-700">
          <li>👤 Users: {metrics.users || 0}</li>
          <li>💼 Jobs: {metrics.jobs || 0}</li>
          <li>📄 Resumes: {metrics.resumes || 0}</li>
          <li>🎤 Interviews: {metrics.interviews || 0}</li>
        </ul>
      </div>

      {/* Card 2: Pie Chart */}
      <div className="card p-4 shadow-lg rounded-2xl">
        <h2 className="text-lg font-bold mb-4">Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={usersData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {usersData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Card 3: Bar Chart */}
      <div className="card p-4 shadow-lg rounded-2xl">
        <h2 className="text-lg font-bold mb-4">Entity Counts</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={usersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Card 4: Line Chart (Fake Growth Data) */}
      <div className="card p-4 shadow-lg rounded-2xl">
        <h2 className="text-lg font-bold mb-4">User Growth</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={[
              { month: "Jan", users: 10 },
              { month: "Feb", users: 30 },
              { month: "Mar", users: 50 },
              { month: "Apr", users: metrics.users || 70 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#10B981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
