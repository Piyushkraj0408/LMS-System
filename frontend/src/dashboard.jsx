import { useState, useEffect } from "react";
import "./student.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dash() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUser();
    fetchDashboard();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("https://lms-system-zm6u.onrender.com/student/details", {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  const fetchDashboard = async () => {
    try {
      const [c, a, n] = await Promise.all([
        axios.get("https://lms-system-zm6u.onrender.com/student/recent-courses", {
          withCredentials: true,
        }),
        axios.get("https://lms-system-zm6u.onrender.com/student/assignments", {
          withCredentials: true,
        }),
        axios.get("https://lms-system-zm6u.onrender.com/student/notifications", {
          withCredentials: true,
        }),
      ]);
      setCourses(c.data);
      setAssignments(a.data);
      setNotifications(n.data);
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  return (
    <div className="main-dash">
      <div className="dash">
        <div className="access">
          <div className="header-section">
            <h1>
              Hi, <span className="user-name">{user?.name || "Student"}</span>{" "}
              👋
            </h1>
            <h3 style={{marginLeft:"15px"}}>Here is your learning overview</h3>
          </div>
        </div>

        <div className="card-container">
          {courses.map((course) => (
            <div className="card" key={course._id}>
              <img src={course.img || "/default"} alt="coursepic" />
              <h4>{course.title}</h4>
              <p>{course.description || "Continue your learning journey"}</p>
              <button onClick={() => navigate(`/student/course/${course._id}`)}>Open Course</button>
            </div>
          ))}
        </div>
      </div>

      <div className="side-panel">
        <div className="deadlines">
          <h3>📅 Deadlines</h3>
          {assignments.map((a) => (
            <div className="list-item" key={a._id}>
              <p>{a.title}</p>
              <span>{a.dueDate || "Upcoming"}</span>
            </div>
          ))}
        </div>

        <div className="notifications">
          <h3>🔔 Notifications</h3>
          {notifications.map((n) => (
            <div
              className={`list-item ${n.isRead ? "" : "unread"}`}
              key={n._id}
            >
              <p>{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
