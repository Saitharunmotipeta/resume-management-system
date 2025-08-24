import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import {
  Users,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";

export default function JobResumes() {
  const { id } = useParams(); // job ID from route
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewMode, setInterviewMode] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");

  // Guard: if no job ID
  if (!id) {
    return (
      <div className="flex items-center gap-2 text-red-600 font-semibold p-5">
        <AlertCircle className="w-5 h-5" />
        Job ID is missing in URL.
      </div>
    );
  }

  // Fetch resumes
  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/jobs/${id}/resumes/analyse`);
      setResumes(data);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [id]);

  // Analyse all resumes
  const handleAnalyseAll = async () => {
    try {
      for (let r of resumes) {
        await api.post(`/resumes/match/${r.id}`);
      }
      setMessage("Resumes analysed successfully!");
      fetchResumes();
    } catch {
      setError("Failed to analyse resumes");
    }
  };

  // Schedule interview
  const handleSchedule = async () => {
    try {
      await api.post(`/resumes/interviews/schedule/${id}`, {
        date: interviewDate,
        time: interviewTime,
        mode: interviewMode,
        location: interviewLocation || null,
      });
      setMessage("Interview scheduled successfully!");
      setShowModal(false);
      fetchResumes();
    } catch (e) {
      setError(e?.response?.data || "Failed to schedule interview");
    }
  };

  // Shortlist or reject
  const handleAction = async (resumeId, action) => {
    try {
      await api.post(`/resumes/${action}/${resumeId}`);
      fetchResumes();
    } catch (e) {
      setError(e?.response?.data || "Action failed");
    }
  };

  if (loading)
    return (
      <div className="card p-5 text-gray-600 flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading resumes...
      </div>
    );

  return (
    <div className="space-y-5 p-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Users className="w-6 h-6 text-indigo-600" /> Applicants for Job #{id}
      </h2>

      <div className="flex gap-3">
        <button
          onClick={handleAnalyseAll}
          className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Analyse All Resumes
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="btn bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Schedule Interview
        </button>
      </div>

      {message && (
        <div className="flex items-center gap-2 text-green-700 font-semibold mt-2">
          <CheckCircle className="w-5 h-5" />
          {message}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-red-600 font-medium mt-2">
          <XCircle className="w-5 h-5" />
          {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="card text-gray-600 mt-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          No resumes submitted yet.
        </div>
      ) : (
        resumes.map((r) => (
          <div
            key={r.id}
            className="card p-5 shadow-md rounded-xl flex justify-between items-start hover:shadow-lg transition"
          >
            <div>
              <div className="flex items-center gap-2 font-semibold text-lg">
                <FileText className="w-5 h-5 text-indigo-600" /> Resume #{r.id}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Email: {r.email} | Phone: {r.phone}
              </div>
              <div className="text-sm mt-1">
                Match Score:{" "}
                <span className="font-medium text-indigo-600">
                  {r.match_score ?? "N/A"}
                </span>
              </div>
              <div className="text-sm mt-1 flex items-center gap-1">
                Status:{" "}
                <span
                  className={`flex items-center gap-1 ${
                    r.shortlisted === "yes"
                      ? "text-green-600 font-medium"
                      : r.shortlisted === "no"
                      ? "text-red-600 font-medium"
                      : "text-gray-600 font-medium"
                  }`}
                >
                  {r.shortlisted === "yes" && <CheckCircle className="w-4 h-4" />}
                  {r.shortlisted === "no" && <XCircle className="w-4 h-4" />}
                  {r.shortlisted === null && <Info className="w-4 h-4" />}
                  {r.shortlisted === "yes"
                    ? "Shortlisted"
                    : r.shortlisted === "no"
                    ? "Rejected"
                    : "Pending"}
                </span>
              </div>
              {r.interview_date && r.interview_time && (
                <div className="text-sm mt-2 flex items-center gap-2 text-blue-600">
                  <Calendar className="w-4 h-4" />
                  {r.interview_date} at {r.interview_time}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleAction(r.id, "shortlist")}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg shadow"
              >
                <CheckCircle className="w-4 h-4" /> Shortlist
              </button>
              <button
                onClick={() => handleAction(r.id, "reject")}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 space-y-3">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" /> Schedule Interview
            </h3>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="time"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Mode (online/offline)"
              value={interviewMode}
              onChange={(e) => setInterviewMode(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Location (optional)"
              value={interviewLocation}
              onChange={(e) => setInterviewLocation(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded text-white flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSchedule}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" /> Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
