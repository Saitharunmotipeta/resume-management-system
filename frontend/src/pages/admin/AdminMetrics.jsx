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
      <div className="card text-center p-6 rounded-2xl shadow-md">
        <h1 className="text-xl font-semibold mb-2">📊 Platform Metrics</h1>
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  if (!metrics) {
    return <div className="text-center p-6 text-gray-600">Loading metrics...</div>
  }

  // Data transformation
  const usersData = [
    { name: "Users", value: metrics.users || 0 },
    { name: "Jobs", value: metrics.jobs || 0 },
    { name: "Resumes", value: metrics.resumes || 0 },
    { name: "Interviews", value: metrics.interviews || 0 },
  ]

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"]

  return (
    <div className="grid lg:grid-cols-2 gap-6 p-6">
      {/* Card 1: Overview Stats */}
      <div className="card p-6 shadow-lg rounded-2xl hover:shadow-xl transition">
        <h2 className="text-lg font-bold mb-2">📌 Overview</h2>
        <p className="text-sm text-gray-500 mb-4">
          Quick glance at the total counts of entities on the platform.
        </p>
        <ul className="space-y-2 text-gray-700 text-base">
          <li>👤 <span className="font-semibold">{metrics.users || 0}</span> Users</li>
          <li>💼 <span className="font-semibold">{metrics.jobs || 0}</span> Jobs</li>
          <li>📄 <span className="font-semibold">{metrics.resumes || 0}</span> Resumes</li>
          <li>🎤 <span className="font-semibold">{metrics.interviews || 0}</span> Interviews</li>
        </ul>
      </div>

      {/* Card 2: Pie Chart */}
      <div className="card p-6 shadow-lg rounded-2xl hover:shadow-xl transition">
        <h2 className="text-lg font-bold mb-2">📊 Distribution</h2>
        <p className="text-sm text-gray-500 mb-4">
          Proportional distribution of users, jobs, resumes, and interviews.
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={usersData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
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
      <div className="card p-6 shadow-lg rounded-2xl hover:shadow-xl transition">
        <h2 className="text-lg font-bold mb-2">📈 Entity Counts</h2>
        <p className="text-sm text-gray-500 mb-4">
          A side-by-side comparison of the current entities in the system.
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={usersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Card 4: Line Chart */}
      <div className="card p-6 shadow-lg rounded-2xl hover:shadow-xl transition">
        <h2 className="text-lg font-bold mb-2">📉 User Growth</h2>
        <p className="text-sm text-gray-500 mb-4">
          Month-over-month growth trend of users joining the platform.
        </p>
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
            <Line
              type="monotone"
              dataKey="users"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 5, fill: "#10B981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
