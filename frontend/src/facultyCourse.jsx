import { useState } from "react";
import axios from "axios";
import "./student.css";

export default function FacultyCourse() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

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
        formData.append("image", image); // 👈 must match backend field name
      }

      const res = await axios.post(
        "http://localhost:5000/create-course",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message);
      setTitle("");
      setCode("");
      setDescription("");
      setImage(null);
      setPreview("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Error creating course");
    }
  };

  return (
    <div className="fac-course fac">
      <h2>Create New Course</h2>

      <form onSubmit={handleSubmit} className="course-form">
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

        {/* 🖼 Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* 🔍 Preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="course-preview"
          />
        )}

        <button type="submit">Create Course</button>
      </form>

      {message && <p className="msg">{message}</p>}
    </div>
  );
}