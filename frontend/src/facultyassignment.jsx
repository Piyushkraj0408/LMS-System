import { useEffect, useState } from "react";
import axios from "axios";
import FacultySubmissions from "./facultySubmissions";
import "./student.css";

export default function FacultyAssignment() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignments, setAssignments] = useState([]);

  // 🔄 Load faculty courses
  useEffect(() => {
    axios
      .get("http://localhost:5000/faculty-courses", { withCredentials: true })
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 🔄 Load faculty assignments
  useEffect(() => {
    axios
      .get("http://localhost:5000/faculty-assignments", { withCredentials: true })
      .then((res) => {
        console.log("Assignments:", res.data);
        setAssignments(res.data);
      })
      .catch((err) => console.log("Assignment fetch error:", err));
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/create-assignment",
        { title, description, courseId, dueDate },
        { withCredentials: true }
      );

      alert(res.data.message);

      // Add new assignment to list
      setAssignments((prev) => [...prev, res.data.assignment]);

      setTitle("");
      setDescription("");
      setCourseId("");
      setDueDate("");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Error creating assignment");
    }
  };

  return (
    <div className="fac-assignment11 fac">
      <h2>📝 Create Assignment</h2>

      <form onSubmit={handleCreateAssignment}>
        <input
          type="text"
          placeholder="Assignment Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          required
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        <input
          type="date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button type="submit">Create Assignment</button>
      </form>

      <hr />

      <h2>📚 My Assignments</h2>

      {assignments.length === 0 ? (
        <p>No assignments created yet.</p>
      ) : (
        assignments.map((assignment) => (
          <div key={assignment._id} className="assignment-card">
            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>
            <p>
              <b>Due:</b> {new Date(assignment.dueDate).toLocaleDateString()}
            </p>

            {/* Show Submissions */}
            <FacultySubmissions assignmentId={assignment._id} />
          </div>
        ))
      )}
    </div>
  );
}