import { useEffect, useState } from "react";
import axios from "axios";
import "./student.css";

export default function Facultyattendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load faculty courses
  useEffect(() => {
    axios
      .get("https://lms-system-zm6u.onrender.com/faculty-courses", { withCredentials: true })
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Load enrolled students
  const loadStudents = async (courseId) => {
    if (!courseId) return;
    
    setSelectedCourse(courseId);
    setLoading(true);
    
    try {
      const res = await axios.get(
        `https://lms-system-zm6u.onrender.com/course-students/${courseId}`,
        { withCredentials: true }
      );

      setStudents(res.data);
      setRecords(
        res.data.map((s) => ({
          studentId: s.studentId._id,
          status: "Present", // default
        }))
      );
    } catch (err) {
      console.log(err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (index, value) => {
    const newRec = [...records];
    newRec[index].status = value;
    setRecords(newRec);
  };

  const submitAttendance = async () => {
    if (!selectedCourse) {
      alert("Please select a course first");
      return;
    }

    setLoading(true);
    
    try {
      const res = await axios.post(
        "https://lms-system-zm6u.onrender.com/mark-attendance",
        { courseId: selectedCourse, records },
        { withCredentials: true }
      );
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`faculty-attendance ${loading ? 'loading' : ''}`}>
      <h2>📋 Mark Attendance</h2>

      {/* Select Course */}
      <select 
        value={selectedCourse}
        onChange={(e) => loadStudents(e.target.value)}
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.title}
          </option>
        ))}
      </select>

      {/* Student List */}
      {students.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id}>
                  <td style={{position:"absolute"}}>{s.studentId.name}</td>
                  <td>{s.studentId.email}</td>
                  <td>
                    <select
                      value={records[i]?.status}
                      onChange={(e) => updateStatus(i, e.target.value)}
                    >
                      <option value="Present">✓ Present</option>
                      <option value="Absent">✗ Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={submitAttendance}>
            Submit Attendance
          </button>
        </>
      )}

      {selectedCourse && students.length === 0 && !loading && (
        <p>No students enrolled in this course yet.</p>
      )}
    </div>
  );
}