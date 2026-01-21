import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./student.css";

export default function Quiz() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://lms-system-zm6u.onrender.com/my-courses", { withCredentials: true })
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
      <div className="studentquiz-home">
        <div className="loading-courses">
          <div className="loader"></div>
          <p>Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="studentquiz-home">
      <h2>Select Course for Quiz</h2>

      {courses.length === 0 ? (
        <p>You are not enrolled in any course.</p>
      ) : (
        <div className="studentcourse-grid">
          {courses.map((c) => (
            <div
              key={c.courseId._id}
              className="quiz-course-card"
              onClick={() => navigate(`/student/quizzes/${c.courseId._id}`)}
            >
              <h3>{c.courseId.title}</h3>
              <p>{c.courseId.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}