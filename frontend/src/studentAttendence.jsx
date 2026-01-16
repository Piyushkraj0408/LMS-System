import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StudentAttendance() {
  const { courseId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    console.log("📌 Course ID:", courseId);

    axios
      .get(`http://localhost:5000/my-attendance/${courseId}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("✅ Attendance Data:", res.data);
        setAttendance(res.data);
      })
      .catch((err) => {
        console.log("❌ Attendance Error:", err.response?.data || err.message);
        alert("Failed to load attendance");
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  // Calculate attendance percentage
  const totalClasses = attendance.length;
  const presentCount = attendance.filter(a => a.status === "Present").length;
  const attendancePercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="attendance-view-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-view-page">
      <div className="attendance-header">
        <h2>My Attendance Record</h2>
        
        {attendance.length > 0 && (
          <div className="attendance-stats">
            <div className="stat-card">
              <span className="stat-icon">📊</span>
              <div className="stat-info">
                <p className="stat-label">Total Classes</p>
                <p className="stat-value">{totalClasses}</p>
              </div>
            </div>
            
            <div className="stat-card present">
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <p className="stat-label">Present</p>
                <p className="stat-value">{presentCount}</p>
              </div>
            </div>
            
            <div className="stat-card absent">
              <span className="stat-icon">❌</span>
              <div className="stat-info">
                <p className="stat-label">Absent</p>
                <p className="stat-value">{totalClasses - presentCount}</p>
              </div>
            </div>
            
            <div className={`stat-card percentage ${attendancePercentage >= 75 ? 'good' : 'warning'}`}>
              <span className="stat-icon">📈</span>
              <div className="stat-info">
                <p className="stat-label">Percentage</p>
                <p className="stat-value">{attendancePercentage}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {attendance.length === 0 ? (
        <div className="empty-attendance">
          <span className="empty-icon">📋</span>
          <p>No attendance marked yet.</p>
          <p className="empty-subtitle">Your attendance records will appear here once marked by faculty.</p>
        </div>
      ) : (
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>
                  <span className="th-icon">📅</span>
                  Date
                </th>
                <th>
                  <span className="th-icon">🗓️</span>
                  Day
                </th>
                <th>
                  <span className="th-icon">✓</span>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a, index) => (
                <tr key={a._id} className={`attendance-row ${a.status.toLowerCase()}`}>
                  <td data-label="Date">{new Date(a.date).toLocaleDateString()}</td>
                  <td data-label="Day">{a.day}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${a.status.toLowerCase()}`}>
                      {a.status === "Present" ? "✓ Present" : "✗ Absent"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}