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
      .get("https://lms-system-zm6u.onrender.com/faculty-courses", { withCredentials: true })
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 📚 Load students of a course
  const loadStudents = async (courseId) => {
    setLoading(true);
    setSelectedCourse(courseId);
    try {
      const res = await axios.get(
        `https://lms-system-zm6u.onrender.com/course-students/${courseId}`,
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
    <div className={`faculty-students ${loading ? 'loading' : ''}`}>
      <h2>📚 My Courses</h2>

      {/* 📘 Course List */}
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
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
      )}

      {/* 👩‍🎓 Student List */}
      {selectedCourse && (
        <>
          <h3>
            👥 Enrolled Students
            {students.length > 0 && ` (${students.length})`}
          </h3>

          {loading ? (
            <p>Loading students...</p>
          ) : students.length === 0 ? (
            <p>No students enrolled yet.</p>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email Address</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td style={{position:"absolute"}}>{s.studentId?.name || "N/A"}</td>
                    <td>{s.studentId?.email || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}