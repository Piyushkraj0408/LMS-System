import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Grade() {
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
      <div className="grade-selection-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grade-selection-page">
      <h2>Select Course to View Grades</h2>

      {courses.length === 0 ? (
        <div className="empty-grades">
          <span className="empty-icon">📚</span>
          <p>No courses enrolled yet.</p>
        </div>
      ) : (
        <div className="grade-course-grid">
          {courses.map((c, index) => (
            <div
              key={c.courseId._id}
              className="grade-course-card"
              onClick={() => navigate(`/student/grade/${c.courseId._id}`)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-top">
                <span className="course-icon">📊</span>
                <span className="view-grades-badge">View Grades</span>
              </div>
              <h3>{c.courseId.title}</h3>
              <p>{c.courseId.description}</p>
              <div className="card-footer">
                <span className="arrow-icon">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}