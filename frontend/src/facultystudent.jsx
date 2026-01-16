import { useEffect, useState } from "react";
import axios from "axios";
import "./student.css";

export default function FacultyStudent() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch faculty courses
  useEffect(() => {
    axios
      .get("http://localhost:5000/faculty-courses", { withCredentials: true })
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 📚 Load students of a course
  const loadStudents = async (courseId) => {
    setLoading(true);
    setSelectedCourse(courseId);
    try {
      const res = await axios.get(
        `http://localhost:5000/course-students/${courseId}`,
        { withCredentials: true }
      );

      console.log("📥 Students received:", res.data);
      setStudents(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-students">
      <h2>My Courses</h2>

      {/* 📘 Course List */}
      <div className="course-list">
        {courses.map((course) => (
          <button
            key={course._id}
            onClick={() => loadStudents(course._id)}
            className={selectedCourse === course._id ? "active-course" : ""}
          >
            {course.title}
          </button>
        ))}
      </div>

      {/* 👩‍🎓 Student List */}
      <h3>Enrolled Students</h3>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.studentId?.name}</td>
                <td>{s.studentId?.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
