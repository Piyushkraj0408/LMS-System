import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./student.css";

const Studentmycourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/student/mycourses",
          { withCredentials: true }
        );
        
        setCourses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="fac">

      <h2>My Enrolled Courses</h2>

      {courses.length === 0 && <p>You are not enrolled in any course yet.</p>}

      <div className="course-grid">
        {courses.map((item) => (
          <div
            key={item._id}
            className="courses-card"
            onClick={() => navigate(`/student/course/${item.courseId._id}`)}
          >
            {item.courseId.image && (
              <img
                src={`http://localhost:5000${item.courseId.image}`}
                alt={item.courseId.title}
              />
            )}
            <h3>{item.courseId.title}</h3>
            <p>{item.courseId.code}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studentmycourses;
