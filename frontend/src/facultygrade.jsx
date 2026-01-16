import { useEffect, useState } from "react";
import axios from "axios";

export default function Facultygrade() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [files, setFiles] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/faculty-courses", { withCredentials: true })
      .then(res => setCourses(res.data))
      .catch(err => console.log(err));
  }, []);

  const loadStudents = async (courseId) => {
    setSelectedCourse(courseId);
    try {
      const res = await axios.get(`http://localhost:5000/course-students/${courseId}`, {
        withCredentials: true,
      });
      setStudents(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load students");
    }
  };

  const handleSubmitGrade = async (studentId) => {
    const formData = new FormData();
    formData.append("courseId", selectedCourse);
    formData.append("studentId", studentId);
    formData.append("marks", marks[studentId]);

    if (files[studentId]) {
      formData.append("paper", files[studentId]);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/submit-grade",
        formData,
        { withCredentials: true }
      );
      alert("Grade submitted!");
    } catch (err) {
      console.log(err);
      alert("Failed to submit grade");
    }
  };

  return (
    <div>
      <h2>Grade Students</h2>

      <select onChange={(e) => loadStudents(e.target.value)}>
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>{c.title}</option>
        ))}
      </select>

      {students.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Marks</th>
              <th>Paper Upload</th>
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.studentId._id}>
                <td>{s.studentId.name}</td>
                <td>{s.studentId.email}</td>
                <td>
                  <input
                    type="number"
                    placeholder="Enter marks"
                    value={marks[s.studentId._id] || ""}
                    onChange={(e) =>
                      setMarks({ ...marks, [s.studentId._id]: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFiles({ ...files, [s.studentId._id]: e.target.files[0] })
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleSubmitGrade(s.studentId._id)}>
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
