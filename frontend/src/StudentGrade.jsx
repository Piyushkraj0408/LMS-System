import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StudentGrade() {
  const { courseId } = useParams();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    axios
      .get(`https://lms-system-zm6u.onrender.com/my-grades/${courseId}`, { withCredentials: true })
      .then((res) => {
        setGrades(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [courseId]);

  // Calculate statistics
  const totalMarks = grades.reduce((sum, g) => sum + g.marks, 0);
  const averageMarks = grades.length > 0 ? (totalMarks / grades.length).toFixed(2) : 0;
  const highestMarks = grades.length > 0 ? Math.max(...grades.map(g => g.marks)) : 0;
  const lowestMarks = grades.length > 0 ? Math.min(...grades.map(g => g.marks)) : 0;

  // Get grade letter
  const getGradeLetter = (marks) => {
    if (marks >= 90) return { letter: 'A+', color: '#22c55e' };
    if (marks >= 80) return { letter: 'A', color: '#3b82f6' };
    if (marks >= 70) return { letter: 'B+', color: '#8b5cf6' };
    if (marks >= 60) return { letter: 'B', color: '#f59e0b' };
    if (marks >= 50) return { letter: 'C', color: '#ef4444' };
    return { letter: 'F', color: '#dc2626' };
  };

  if (loading) {
    return (
      <div className="student-grade-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your grades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-grade-page">
      <div className="grade-page-header">
        <h2>My Grades</h2>
        
        {grades.length > 0 && (
          <div className="grade-stats-grid">
            <div className="grade-stat-card">
              <span className="stat-icon">📝</span>
              <div className="stat-content">
                <p className="stat-label">Total Assessments</p>
                <p className="stat-value">{grades.length}</p>
              </div>
            </div>
            
            <div className="grade-stat-card average">
              <span className="stat-icon">📊</span>
              <div className="stat-content">
                <p className="stat-label">Average Score</p>
                <p className="stat-value">{averageMarks}%</p>
              </div>
            </div>
            
            <div className="grade-stat-card highest">
              <span className="stat-icon">🏆</span>
              <div className="stat-content">
                <p className="stat-label">Highest Score</p>
                <p className="stat-value">{highestMarks}%</p>
              </div>
            </div>
            
            <div className="grade-stat-card lowest">
              <span className="stat-icon">📉</span>
              <div className="stat-content">
                <p className="stat-label">Lowest Score</p>
                <p className="stat-value">{lowestMarks}%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {grades.length === 0 ? (
        <div className="empty-grades-view">
          <span className="empty-icon">📋</span>
          <p>No grades published yet.</p>
          <p className="empty-subtitle">Your grades will appear here once published by faculty.</p>
        </div>
      ) : (
        <div className="grades-table-container">
          <table className="grades-table">
            <thead>
              <tr>
                <th>
                  <span className="th-icon">#</span>
                  S.No
                </th>
                <th>
                  <span className="th-icon">📊</span>
                  Marks
                </th>
                <th>
                  <span className="th-icon">🎯</span>
                  Grade
                </th>
                <th>
                  <span className="th-icon">📄</span>
                  Paper
                </th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g, index) => {
                const gradeInfo = getGradeLetter(g.marks);
                return (
                  <tr key={g._id} className="grade-row">
                    <td data-label="S.No">
                      <span className="serial-number">{index + 1}</span>
                    </td>
                    <td data-label="Marks">
                      <div className="marks-container">
                        <span className="marks-value">{g.marks}</span>
                        <span className="marks-total">/ 100</span>
                      </div>
                    </td>
                    <td data-label="Grade">
                      <span 
                        className="grade-badge" 
                        style={{ 
                          background: `${gradeInfo.color}20`,
                          color: gradeInfo.color,
                          borderColor: `${gradeInfo.color}50`
                        }}
                      >
                        {gradeInfo.letter}
                      </span>
                    </td>
                    <td data-label="Paper">
                      {g.paperFile ? (
                        <a
                          href={`https://lms-system-zm6u.onrender.com/${g.paperFile}`}
                          target="_blank"
                          rel="noreferrer"
                          className="view-paper-link"
                        >
                          <span className="link-icon">📎</span>
                          View Paper
                          <span className="link-arrow">→</span>
                        </a>
                      ) : (
                        <span className="no-file">No file</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}