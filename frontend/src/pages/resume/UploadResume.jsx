import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState("");
  const [existingResume, setExistingResume] = useState(null); // ✅ track if already submitted

  const token = localStorage.getItem("access_token");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  // ✅ Check if resume already exists for this job
  useEffect(() => {
    if (!jobId || !token) return;

    axios
      .get(`http://localhost:8000/resumes/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setExistingResume(res.data); // backend should return { fileName, score, summary }
      })
      .catch(() => setExistingResume(null));
  }, [jobId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobId || !email || !phone) {
      setMessage("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_id", jobId);
    formData.append("email", email);
    formData.append("phone", phone);

    try {
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

      setMessage(data.msg);
      setScore(data.score);
      setSummary(data.summary);
      setExistingResume(data); // ✅ mark resume as submitted
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.detail || error.response.status}`);
      } else {
        setMessage("An error occurred while uploading.");
      }
    }
  };

  const handleUnsubmit = async () => {
    if (!window.confirm("Are you sure you want to unsubmit your resume?")) return;

    try {
      await axios.delete(`http://localhost:8000/resumes/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingResume(null);
      setMessage("Resume removed. You can now upload another.");
      setScore(null);
      setSummary("");
    } catch (error) {
      setMessage("Failed to unsubmit resume.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Upload Resume</h2>

      {existingResume ? (
        // ✅ If already submitted
        <div>
          <p>✅ Resume submitted for Job ID: {jobId}</p>
          <p><strong>Match Score:</strong> {existingResume.score}</p>
          <p><strong>Summary:</strong> {existingResume.summary}</p>
          <button
            onClick={handleUnsubmit}
            style={{ background: "red", color: "white", padding: "5px 10px", marginTop: "10px" }}
          >
            Unsubmit Resume
          </button>
        </div>
      ) : (
        // ✅ If not submitted yet
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label>Resume (PDF only): </label>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Job ID: </label>
            <input type="number" value={jobId} onChange={(e) => setJobId(e.target.value)} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email: </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Phone: </label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button type="submit" style={{ padding: "5px 10px" }}>Upload</button>
        </form>
      )}

      {message && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
};

export default UploadResume;
