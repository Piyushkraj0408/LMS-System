import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Attendeance() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/my-courses", { withCredentials: true })
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="attendance-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <h2>Select Course for Attendance</h2>

      {courses.length === 0 ? (
        <p>You are not enrolled in any course.</p>
      ) : (
        <div className="course-grid" style={{marginTop:"-160px"}}>
          {courses.map((c) => (
            <div
              key={c.courseId._id}
              className="attendance-course-card"
              onClick={() => navigate(`/student/attendance/${c.courseId._id}`)}
            >
              <h3>{c.courseId.title}</h3>
              <p>{c.courseId.description}</p>
              {/* Optional: Add attendance percentage if available */}
              {/* <span className="attendance-badge">85%</span> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}