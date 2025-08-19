import React, { useState } from "react";
import axios from "axios";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

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

    const token = localStorage.getItem("access_token"); // ✅ match AuthContext
    if (!token) {
      setMessage("You must be logged in to upload a resume.");
      return;
    }

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
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.detail || error.response.status}`);
      } else {
        setMessage("An error occurred while uploading.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Upload Resume</h2>
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

      {message && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{message}</p>}
      {score !== null && (
        <div style={{ marginTop: "10px" }}>
          <p><strong>Match Score:</strong> {score}</p>
          <p><strong>Summary:</strong> {summary}</p>
        </div>
      )}
    </div>
  );
};

export default UploadResume;
