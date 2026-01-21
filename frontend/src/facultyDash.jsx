import "./student.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FacultyDash() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [achievements, setAchievements] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [c, a, n, ach] = await Promise.all([
        axios.get("https://lms-system-zm6u.onrender.com/faculty/recent-courses", { withCredentials: true }),
        axios.get("https://lms-system-zm6u.onrender.com/faculty/recent-assignments", { withCredentials: true }),
        axios.get("https://lms-system-zm6u.onrender.com/faculty/notifications", { withCredentials: true }),
        axios.get("https://lms-system-zm6u.onrender.com/faculty/achievements", { withCredentials: true }),
      ]);
      console.log(c.data);
      setCourses(c.data);
      setAssignments(a.data);
      setNotifications(n.data);
      setAchievements(ach.data);
    } catch (err) {
      console.log("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fac11-dash">
        <div className="gyan11 loading-card">
          <h1>Loading Dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="fac11-dash">

      {/* 👋 Header */}
      <div className="gyan11">
        <h1>Welcome {courses[0].facultyId.name}</h1>
        <p>Your teaching activity summary and quick access panel.</p>
      </div>

      {/* 🏆 Achievements */}
      <div className="fac11-card fac">
        <h2>🏆 Achievements</h2>
        <p>📚 Courses: <strong>{achievements.totalCourses || 0}</strong></p>
        <p>👥 Students Taught: <strong>{achievements.totalStudents || 0}</strong></p>
        <p>📝 Assignments Posted: <strong>{achievements.totalAssignments || 0}</strong></p>
      </div>

      {/* 📘 Recent Courses */}
      <div className="fac11-course fac">
        <h2>📘 Recent Courses</h2>
        {courses.length === 0 ? (
          <p style={{ 
            textAlign: 'center', 
            color: 'var(--gray-light)', 
            fontStyle: 'italic',
            border: 'none',
            cursor: 'default'
          }}>
            No courses available yet
          </p>
        ) : (
          courses.map((c) => (
            <p key={c._id}>📘 {c.title}</p>
          ))
        )}
      </div>

      {/* 📝 Recent Assignments */}
      <div className="fac11-assignment fac">
        <h2>📝 Recent Assignments</h2>
        {assignments.length === 0 ? (
          <p style={{ 
            textAlign: 'center', 
            color: 'var(--gray-light)', 
            fontStyle: 'italic',
            border: 'none',
            cursor: 'default'
          }}>
            No assignments posted yet
          </p>
        ) : (
          assignments.map((a) => (
            <p key={a._id}>
              📝 {a.title} <span>({a.courseId?.title || 'N/A'})</span>
            </p>
          ))
        )}
      </div>

      {/* 🔔 Notifications */}
      <div className="fac11-notification fac">
        <h2>🔔 Notifications</h2>
        {notifications.length === 0 ? (
          <p style={{ 
            textAlign: 'center', 
            color: 'var(--gray-light)', 
            fontStyle: 'italic',
            border: 'none',
            cursor: 'default'
          }}>
            No new notifications
          </p>
        ) : (
          notifications.map((n) => (
            <p key={n._id}>
              🔔 {n.message} <span>({n.courseId?.title || 'N/A'})</span>
            </p>
          ))
        )}
      </div>

    </div>
  );
}