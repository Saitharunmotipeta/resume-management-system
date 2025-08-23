import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function JobResumes() {
  const { id } = useParams();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewMode, setInterviewMode] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");

  const fetchResumes = async () => {
    try {
      const { data } = await api.get(`/resumes/job/${id}`);
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

  const handleAnalyseAll = async () => {
    try {
      for (let r of resumes) {
        await api.post(`/resumes/match/${r.id}`);
      }
      setMessage("Resumes analysed successfully!");
      fetchResumes();
    } catch (e) {
      setMessage("Failed to analyse resumes");
    }
  };

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
      setMessage("Failed to schedule interview");
      setError(e?.response?.data || "Unknown error");
    }
  };

  const handleAction = async (resumeId, action) => {
    try {
      await api.post(`/resumes/${action}/${resumeId}`);
      fetchResumes();
    } catch (e) {
      setMessage("Action failed");
      setError(e?.response?.data || "Unknown error");
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-3">Applicants for Job #{id}</h2>

      <div className="space-x-2">
        <button
          onClick={handleAnalyseAll}
          className="btn bg-blue-600 text-white px-3 py-1 rounded"
        >
          Analyse All Resumes
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="btn bg-purple-600 text-white px-3 py-1 rounded"
        >
          Schedule Interview
        </button>
      </div>

      {message && <div className="text-green-600 font-semibold">{message}</div>}
      {error && (
        <div className="text-red-600">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="card">No resumes submitted yet.</div>
      ) : (
        resumes.map((r) => (
          <div key={r.id} className="card p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Resume #{r.id}</div>
                <div className="text-sm text-gray-500">
                  Email: {r.email} | Phone: {r.phone}
                </div>
                <div className="text-sm">
                  Match Score: {r.match_score ?? "N/A"}
                </div>
                <div className="text-sm">
                  Status:{" "}
                  <span
                    className={
                      r.shortlisted === "yes"
                        ? "text-green-600"
                        : r.shortlisted === "no"
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  >
                    {r.shortlisted === "yes"
                      ? "Shortlisted"
                      : r.shortlisted === "no"
                      ? "Rejected"
                      : "Pending"}
                  </span>
                </div>
                {r.interview_date && r.interview_time && (
                  <div className="text-sm text-blue-600">
                    Interview: {r.interview_date} at {r.interview_time}
                  </div>
                )}
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => handleAction(r.id, "shortlist")}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleAction(r.id, "reject")}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Schedule Interview</h3>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="time"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Mode (online/offline)"
              value={interviewMode}
              onChange={(e) => setInterviewMode(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Location (optional)"
              value={interviewLocation}
              onChange={(e) => setInterviewLocation(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-400 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                className="px-3 py-1 bg-purple-600 rounded text-white"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
