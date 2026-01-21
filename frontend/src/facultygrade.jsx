import { useEffect, useState } from "react";
import axios from "axios";
import "./student.css";

export default function Facultygrade() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedStudents, setSubmittedStudents] = useState(new Set());

  useEffect(() => {
    axios
      .get("https://lms-system-zm6u.onrender.com/faculty-courses", { withCredentials: true })
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

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
      setMarks({});
      setFiles({});
      setSubmittedStudents(new Set());
    } catch (err) {
      console.log(err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGrade = async (studentId) => {
    if (!marks[studentId]) {
      alert("Please enter marks for this student");
      return;
    }

    const formData = new FormData();
    formData.append("courseId", selectedCourse);
    formData.append("studentId", studentId);
    formData.append("marks", marks[studentId]);

    if (files[studentId]) {
      formData.append("paper", files[studentId]);
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://lms-system-zm6u.onrender.com/submit-grade",
        formData,
        { withCredentials: true }
      );
      alert("Grade submitted successfully!");
      
      // Mark student as submitted
      setSubmittedStudents(prev => new Set([...prev, studentId]));
    } catch (err) {
      console.log(err);
      alert("Failed to submit grade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`faculty-grade ${loading ? 'loading' : ''}`}>
      <h2>📊 Grade Students</h2>

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

      {students.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>Marks</th>
              <th>Graded Paper</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody >
            {students.map((s) => (
              <tr
                key={s.studentId._id}
                className={submittedStudents.has(s.studentId._id) ? 'submitted' : ''}
              >
                <td style={{position:"absolute",top:"10px",left:"15px"}}>{s.studentId.name}</td>
                <td>{s.studentId.email}</td>
                <td>
                  <input
                    type="number"
                    placeholder="0-100"
                    min="0"
                    max="100"
                    value={marks[s.studentId._id] || ""}
                    onChange={(e) =>
                      setMarks({ ...marks, [s.studentId._id]: e.target.value })
                    }
                    disabled={submittedStudents.has(s.studentId._id)}
                  />
                </td>
                <td>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setFiles({ ...files, [s.studentId._id]: e.target.files[0] })
                    }
                    disabled={submittedStudents.has(s.studentId._id)}
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleSubmitGrade(s.studentId._id)}
                    disabled={submittedStudents.has(s.studentId._id)}
                  >
                    {submittedStudents.has(s.studentId._id) ? 'Submitted' : 'Submit'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedCourse && students.length === 0 && !loading && (
        <p>No students enrolled in this course yet.</p>
      )}
    </div>
  );
}