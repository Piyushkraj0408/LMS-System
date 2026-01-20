import "./student.css";
import { useState } from "react";
import axios from "axios";

export default function Admin() {
  const [studentName, setStudentName] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const [facultyName, setFacultyName] = useState("");
  const [facultyPassword, setFacultyPassword] = useState("");
  const [facultyEmail, setFacultyEmail] = useState("");

  const [loading, setLoading] = useState(false);

  // 👉 Create Student
  const handleSubmitStudents = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(
        "http://localhost:5000/create-student",
        {
          name: studentName,
          email: studentEmail,
          password: studentPassword,
        },
        { withCredentials: true }
      );

      alert(res.data.message || "Student created successfully!");

      // Clear fields
      setStudentName("");
      setStudentEmail("");
      setStudentPassword("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Error creating student");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitfaculty = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post(
        "http://localhost:5000/create-faculty",
        {
          name: facultyName,
          email: facultyEmail,
          password: facultyPassword,
        },
        { withCredentials: true }
      );
      
      alert(res.data.message || "Faculty created successfully!");
      
      // Clear fields
      setFacultyName("");
      setFacultyEmail("");
      setFacultyPassword("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Error creating faculty");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`admin-dashboard ${loading ? 'loading' : ''}`}>
      <h1>🔐 Admin Dashboard</h1>

      <div className="admin-forms-grid">
        {/* ===== Create Student ===== */}
        <form onSubmit={handleSubmitStudents}>
          <h3>👨‍🎓 Create Student</h3>

          <input
            type="text"
            placeholder="Student Name"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Student Email"
            required
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            minLength="6"
            value={studentPassword}
            onChange={(e) => setStudentPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Student'}
          </button>
        </form>

        {/* ===== Create Faculty ===== */}
        <form onSubmit={handleSubmitfaculty}>
          <h3>👨‍🏫 Create Faculty</h3>

          <input
            type="text"
            placeholder="Faculty Name"
            required
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Faculty Email"
            required
            value={facultyEmail}
            onChange={(e) => setFacultyEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            minLength="6"
            value={facultyPassword}
            onChange={(e) => setFacultyPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Faculty'}
          </button>
        </form>
      </div>
    </div>
  );
}