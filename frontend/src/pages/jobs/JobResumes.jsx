import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export default function JobResumes() {
  const { id } = useParams(); // job id from URL
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

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
      await api.post(`/resumes/analyse/${id}`);
      setMessage("Resumes analysed successfully!");
      fetchResumes();
    } catch (e) {
      setMessage("Failed to analyse resumes");
    }
  };

  const handleAction = async (resumeId, action) => {
    try {
      await api.post(`/resumes/${resumeId}/${action}`);
      fetchResumes();
    } catch (e) {
      setMessage("Action failed");
    }
  };

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-3">Applicants for Job #{id}</h2>

      <button
        onClick={handleAnalyseAll}
        className="btn bg-blue-600 text-white px-3 py-1 rounded"
      >
        Analyse All Resumes
      </button>

      {message && <div className="text-green-600 font-semibold">{message}</div>}

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

            {r.feedback && (
              <div className="mt-2 text-sm text-gray-700">
                Feedback: {r.feedback}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
