import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  Loader2,
  Mail,
  Phone,
  Hash,
} from "lucide-react";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState("");
  const [existingResume, setExistingResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  // ✅ Check if resume already exists
  useEffect(() => {
    if (!jobId || !token) return;

    setLoading(true);
    axios
      .get(`http://localhost:8000/resumes/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setExistingResume(res.data))
      .catch(() => setExistingResume(null))
      .finally(() => setLoading(false));
  }, [jobId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobId || !email || !phone) {
      setMessage("⚠️ All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_id", jobId);
    formData.append("email", email);
    formData.append("phone", phone);

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:8000/resumes/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Resume uploaded successfully!");
      setScore(data.score);
      setSummary(data.summary);
      setExistingResume(data);
    } catch (error) {
      setMessage(
        `❌ Error: ${
          error.response?.data?.detail || error.response?.status || "Upload failed"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubmit = async () => {
    if (!window.confirm("Are you sure you want to unsubmit your resume?")) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8000/resumes/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingResume(null);
      setMessage("✅ Resume removed. You can now upload another.");
      setScore(null);
      setSummary("");
    } catch (error) {
      setMessage("❌ Failed to unsubmit resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-5">
      <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
        <FileText className="w-5 h-5" /> Upload Resume
      </h2>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" /> Processing...
        </div>
      )}

      {existingResume ? (
        // ✅ Resume Already Submitted
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle className="w-5 h-5" />
            Resume submitted for Job ID: {jobId}
          </p>
          <div className="p-3 bg-gray-50 rounded-md space-y-2">
            <p>
              <strong>Match Score:</strong>{" "}
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-sm">
                {existingResume.score ?? "N/A"}
              </span>
            </p>
            <p>
              <strong>Summary:</strong> {existingResume.summary || "No summary available"}
            </p>
          </div>
          <button
            onClick={handleUnsubmit}
            className="btn flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white w-full justify-center"
          >
            <Trash2 className="w-4 h-4" /> Unsubmit Resume
          </button>
        </div>
      ) : (
        // ✅ Resume Not Submitted Yet
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Resume (PDF only)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Hash className="w-4 h-4" /> Job ID
            </label>
            <input
              type="number"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
              <Phone className="w-4 h-4" /> Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full justify-center"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Uploading..." : "Upload Resume"}
          </button>
        </form>
      )}

      {message && (
        <p
          className={`mt-2 font-medium flex items-center gap-2 ${
            message.startsWith("✅")
              ? "text-green-600"
              : message.startsWith("❌") || message.startsWith("⚠️")
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          <AlertCircle className="w-4 h-4" /> {message}
        </p>
      )}
    </div>
  );
};

export default UploadResume;
