import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Loader2,
  AlertCircle,
  FileText,
  User,
  ClipboardCheck,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

export default function MyResumes({ userId }) { // pass userId as prop
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/resumes/user/${userId}`);
      setResumes(data);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const unsubmitResume = async (resumeId) => {
    try {
      await api.post(`/resumes/${resumeId}/unsubmit`);
      setResumes(resumes.filter((r) => r.id !== resumeId));
    } catch (e) {
      alert(e?.response?.data?.detail || "Failed to unsubmit resume");
    }
  };

  useEffect(() => {
    if (userId) fetchResumes();
  }, [userId]);

  if (loading)
    return (
      <div className="card flex items-center gap-2 text-gray-600">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading resumes...
      </div>
    );

  if (error)
    return (
      <div className="card flex items-center gap-2 text-red-600">
        <AlertCircle className="w-5 h-5" /> {error}
      </div>
    );

  return (
    <div className="space-y-4">
      {resumes.length === 0 && (
        <div className="card flex items-center gap-2 text-gray-500 justify-center">
          <FileText className="w-5 h-5" /> No resumes submitted yet.
        </div>
      )}

      {resumes.map((r) => (
        <div key={r.id} className="card hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" /> {r.candidateName}{" "}
                <span className="text-gray-500">({r.email})</span>
              </div>
              <div className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                <ClipboardCheck className="w-4 h-4 text-green-600" /> Score:{" "}
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                  {r.rating ?? "N/A"}
                </span>
              </div>
              <div className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                <MessageSquare className="w-4 h-4 text-blue-600" /> Feedback:{" "}
                {r.feedback || "No feedback yet"}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={r.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <ExternalLink className="w-4 h-4" /> View Resume
              </a>

              <button
                onClick={() => unsubmitResume(r.id)}
                className="btn flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                Unsubmit
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
