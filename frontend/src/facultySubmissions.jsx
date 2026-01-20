import { useEffect, useState } from "react";
import axios from "axios";
import "./student.css"

export default function FacultySubmissions({ assignmentId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assignmentId) return;

    console.log("Fetching submissions for assignment:", assignmentId);

    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/assignment-submissions/${assignmentId}`,
          { withCredentials: true }
        );
        setSubmissions(res.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  if (loading) return <p>Loading submissions...</p>;

  return (
    <div className="submissions-section">
      <h3>👥 Student Submissions</h3>

      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>File</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._id}>
                <td>{s.studentId?.name || "N/A"}</td>
                <td>{s.studentId?.email || "N/A"}</td>
                <td>
                  <a
                    href={`http://localhost:5000/${s.filePath}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📥 Download
                  </a>
                </td>
                <td>{new Date(s.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}