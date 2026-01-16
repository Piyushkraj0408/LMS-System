import { useState } from "react";
import axios from "axios";
import "./student.css";

export default function AssignmentUpload({ assignmentId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // 📂 Handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage(""); // Clear previous messages
    }
  };

  // 🧲 Drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setMessage("");
    }
  };

  // 📤 Upload file
  const handleSubmit = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignmentId", assignmentId);

    setUploading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/submit-assignment",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("✅ " + (res.data.message || "Uploaded successfully!"));
      setFile(null);

      // Update parent component
      if (onUploadSuccess) {
        onUploadSuccess();
      } // Small delay to show success message
    } catch (err) {
      console.error(err);
      setMessage("❌ " + (err.response?.data?.error || "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFile(null);
    setMessage("");
  };

  return (
    <div className="upload-container">
      <h4>Submit Assignment</h4>

      <div
        className={`drop-zone ${dragging ? "dragging" : ""} ${
          file ? "has-file" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() =>
          document.getElementById(`file-input-${assignmentId}`).click()
        }
      >
        {file ? (
          <div className="file-preview">
            <span className="file-icon">📄</span>
            <div className="file-info">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <button
              className="remove-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="drop-zone-content">
            <span className="upload-icon">📤</span>
            <p className="drop-text">Drag & Drop file here</p>
            <p className="or-text">or</p>
            <span className="browse-text">Click to browse</span>
          </div>
        )}

        <input
          id={`file-input-${assignmentId}`}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf,.doc,.docx,.txt,.zip"
        />
      </div>

      <button
        className="upload-btn"
        onClick={handleSubmit}
        disabled={!file || uploading}
      >
        {uploading ? (
          <>
            <span className="spinner"></span>
            Uploading...
          </>
        ) : (
          <>
            <span>📤</span>
            Submit Assignment
          </>
        )}
      </button>

      {message && (
        <div className={`msg ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
