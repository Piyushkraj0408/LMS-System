import "./student.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FacultyDash() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [achievements, setAchievements] = useState({});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [c, a, n, ach] = await Promise.all([
        axios.get("http://localhost:5000/faculty/recent-courses", { withCredentials: true }),
        axios.get("http://localhost:5000/faculty/recent-assignments", { withCredentials: true }),
        axios.get("http://localhost:5000/faculty/notifications", { withCredentials: true }),
        axios.get("http://localhost:5000/faculty/achievements", { withCredentials: true }),
      ]);

      setCourses(c.data);
      setAssignments(a.data);
      setNotifications(n.data);
      setAchievements(ach.data);
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  return (
    <div className="fac-dash">

      {/* 👋 Header */}
      <div className="gyan">
        <h1>Welcome Faculty</h1>
        <p>Your teaching activity summary and quick access panel.</p>
      </div>

      {/* 🏆 Achievements */}
      <div className="fac-card fac">
        <h2>Achievements</h2>
        <p>Courses: {achievements.totalCourses}</p>
        <p>Students Taught: {achievements.totalStudents}</p>
        <p>Assignments Posted: {achievements.totalAssignments}</p>
      </div>

      {/* 📘 Recent Courses */}
      <div className="fac-course fac">
        <h2>Recent Courses</h2>
        {courses.map((c) => (
          <p key={c._id}>📘 {c.title}</p>
        ))}
      </div>

      {/* 📝 Recent Assignments */}
      <div className="fac-assignment fac">
        <h2>Recent Assignments</h2>
        {assignments.map((a) => (
          <p key={a._id}>
            📝 {a.title} <span>({a.courseId?.title})</span>
          </p>
        ))}
      </div>

      {/* 🔔 Notifications */}
      <div className="fac-notification fac">
        <h2>Notifications</h2>
        {notifications.map((n) => (
          <p key={n._id}>
            🔔 {n.message} <span>({n.courseId?.title})</span>
          </p>
        ))}
      </div>

    </div>
  );
}
