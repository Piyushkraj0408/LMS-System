import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./student.css";

export default function FacultyCourse() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  const [courses, setCourses] = useState([]); // 👈 for showing all courses

  const navigate = useNavigate();

  // 🔄 Fetch all faculty courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("https://lms-system-zm6u.onrender.com/faculty-courses", {
        withCredentials: true,
      });
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("code", code);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post(
        "https://lms-system-zm6u.onrender.com/create-course",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);

      // reset form
      setTitle("");
      setCode("");
      setDescription("");
      setImage(null);
      setPreview("");

      // 🔄 Refresh course list after creating new course
      fetchCourses();

    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating course");
    }
  };

  return (
    <div className="fac-course fac">

      {/* ➕ CREATE COURSE */}
      <h2>Create New Course</h2>

      <form onSubmit={handleSubmit} className="course11-form">
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Course Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <img src={preview} alt="Preview" className="course-preview" />
        )}

        <button type="submit">Create Course</button>
      </form>

      {message && <p className="msg">{message}</p>}

      {/* 📚 SHOW ALL CREATED COURSES */}
      <h2 style={{ marginTop: "30px" }}>My Created Courses</h2>

      {courses.length === 0 && <p>No courses created yet.</p>}

      <div className="course-grid">
        {courses.map((c) => (
          <div
            key={c._id}
            className="courses-card"
            onClick={() => navigate(`/faculty/course/${c._id}`)}
          >
            {c.image && (
              <img
                src={`https://lms-system-zm6u.onrender.com${c.image}`}
                alt={c.title}
              />
            )}
            <h3>{c.title}</h3>
            <p>{c.code}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
