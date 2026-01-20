import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./student.css";

export default function FacultyMyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get("http://localhost:5000/faculty-courses", {
        withCredentials: true,
      });
      setCourses(res.data);
    };

    fetchCourses();
  }, []);

  return (
    <div className="fac">
      <h2>My Courses</h2>

      <div className="course-grid">
        {courses.map((c) => (
          <div
            key={c._id}
            className="course-card"
            onClick={() => navigate(`/faculty/course/${c._id}`)}
          >
            {c.image && (
              <img
                src={`http://localhost:5000${c.image}`}
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
