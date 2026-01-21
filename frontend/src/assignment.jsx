import { useEffect, useState } from "react";
import axios from "axios";
import "./student.css";
import AssignmentUpload from "./AssignmentUpload";

export default function Assignment() {
  const [assignments, setAssignments] = useState([]);
  // In Assignment.jsx
const handleUploadSuccess = (assignmentId) => {
  setAssignments(prevAssignments => 
    prevAssignments.map(a => 
      a._id === assignmentId 
        ? { ...a, submitted: true, submissionStatus: 'submitted' }
        : a
    )
  );
};


  const fetchAssignments = () => {
    axios
      .get("https://lms-system-zm6u.onrender.com/my-assignments", { withCredentials: true })
      .then((res) => setAssignments(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Check if assignment is urgent (due within 3 days)
  const isUrgent = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 3 && diffDays >= 0;
  };

  return (
    <div className="studentassignments">
      <h2>My Assignments</h2>

      {assignments.length === 0 ? (
        <p>No assignments yet.</p>
      ) : (
        assignments.map((a) => (
          <div 
            key={a._id} 
            className={`studentassignment-card ${isUrgent(a.dueDate) ? 'urgent' : ''} ${a.submitted || a.submissionStatus === 'submitted' ? 'submitted' : ''}`}
          >
            <h3>{a.title}</h3>
            <p>
              <b>Course:</b> {a.courseId?.title}
            </p>
            <p>{a.description}</p>
            <p>
              <b>Due:</b> {new Date(a.dueDate).toDateString()}
            </p>
            <AssignmentUpload 
  assignmentId={a._id} 
  onUploadSuccess={() => handleUploadSuccess(a._id)}
/>
          </div>
        ))
      )}
    </div>
  );
}