import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./student.css";

export default function FacultyCoursePage() {
  const { courseId } = useParams();

  const [materials, setMaterials] = useState([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("notes");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // 🔄 Fetch all materials of this course
  const fetchMaterials = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/faculty/course/${courseId}/materials`,
        { withCredentials: true }
      );
      setMaterials(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  // ➕ Add new material
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("courseId", courseId);
      formData.append("title", title);
      formData.append("type", type);

      if (type === "link" || type === "youtube") {
        formData.append("url", url);
      }

      if (type === "notes" || type === "assignment") {
        formData.append("file", file);
      }

      const res = await axios.post(
        "https://lms-system-zm6u.onrender.com/faculty/add-material",
        formData,
        { withCredentials: true }
      );

      setMessage(res.data.message || "Material added");

      // reset form
      setTitle("");
      setType("notes");
      setUrl("");
      setFile(null);

      fetchMaterials();
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to add material");
    }
  };

  return (
    <div className="fac">

      <h2>Manage Course Materials</h2>

      {/* ➕ ADD MATERIAL FORM */}
      <form onSubmit={handleSubmit} className="material-form">

        <input
          type="text"
          placeholder="Material Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="notes">Notes</option>
          <option value="link">Special Link</option>
          <option value="youtube">YouTube</option>
          <option value="assignment">Assignment</option>
        </select>

        {/* URL input for link & youtube */}
        {(type === "link" || type === "youtube") && (
          <input
            type="url"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        )}

        {/* File input for notes & assignment */}
        {(type === "notes" || type === "assignment") && (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        )}

        <button type="submit">Add Material</button>
      </form>

      {message && <p className="msg">{message}</p>}

      {/* 📂 LIST OF MATERIALS */}
      <h3>Uploaded Materials</h3>

      {materials.length === 0 && <p>No materials added yet.</p>}

      {materials.map((m) => (
        <div key={m._id} className="material-item">
          <strong>{m.title}</strong> — {m.type}

          {m.url && (
            <div>
              <a href={m.url} target="_blank" rel="noreferrer">
                Open Link
              </a>
            </div>
          )}

          {m.filePath && (
            <div>
              <a
                href={`http://localhost:5000/${m.filePath}`}
                target="_blank"
                rel="noreferrer"
              >
                Download File
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
