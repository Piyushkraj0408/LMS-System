import { useEffect, useState } from "react";
import axios from "axios";
import "./student.css";

export default function Facultyattendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);

  // Load faculty courses
  useEffect(() => {
    axios
      .get("http://localhost:5000/faculty-courses", { withCredentials: true })
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Load enrolled students
  const loadStudents = async (courseId) => {
    setSelectedCourse(courseId);
    try {
      const res = await axios.get(
        `http://localhost:5000/course-students/${courseId}`,
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
    }
  };

  const updateStatus = (index, value) => {
    const newRec = [...records];
    newRec[index].status = value;
    setRecords(newRec);
  };

  const submitAttendance = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/mark-attendance",
        { courseId: selectedCourse, records },
        { withCredentials: true }
      );
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Failed to mark attendance");
    }
  };

  return (
    <div className="faculty-attendance">
      <h2>Mark Attendance</h2>

      {/* Select Course */}
      <select onChange={(e) => loadStudents(e.target.value)}>
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
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id}>
                  <td>{s.studentId.name}</td>
                  <td>{s.studentId.email}</td>
                  <td>
                    <select
                      value={records[i]?.status}
                      onChange={(e) => updateStatus(i, e.target.value)}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={submitAttendance} style={{ marginTop: "10px" }}>
            Submit Attendance
          </button>
        </>
      )}
    </div>
  );
}
