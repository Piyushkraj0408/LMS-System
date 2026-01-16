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

  // 👉 Create Student
  const handleSubmitStudents = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/create-student",
        {
          name: studentName,
          email: studentEmail,
          password: studentPassword,
        },
        { withCredentials: true } // 👈 send JWT cookie
      );

      alert(res.data.message || "Student created");

      // Clear fields
      setStudentName("");
      setStudentEmail("");
      setStudentPassword("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Error creating student");
    }
  };

  const handleSubmitfaculty = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:5000/create-faculty",
        {
          name: facultyName,
            email: facultyEmail,
            password: facultyPassword,
        },
        { withCredentials: true } // 👈 send JWT cookie
      );
        alert(res.data.message || "Faculty created");
        // Clear fields
        setFacultyName("");
        setFacultyEmail("");
        setFacultyPassword("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Error creating faculty");
    }
    };


  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* ===== Create Student ===== */}
      <form onSubmit={handleSubmitStudents}>
        <h3>Create Student</h3>

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
          value={studentPassword}
          onChange={(e) => setStudentPassword(e.target.value)}
        />

        <button type="submit">Create Student</button>
      </form>
      {/* ===== Create Faculty ===== */}
      <form onSubmit={handleSubmitfaculty}>
        <h3>Create Faculty</h3>

        <input
          type="text"
          placeholder="Faculty Name"
          required
          value={facultyName}
          onChange={(e) => setFacultyName(e.target.value)}
        />

        <input
          type="email"
          placeholder="faculty Email"
          required
          value={facultyEmail}
          onChange={(e) => setFacultyEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={facultyPassword}
          onChange={(e) => setFacultyPassword(e.target.value)}
        />

        <button type="submit">Create Faculty</button>
      </form>
    </div>
  );
}
