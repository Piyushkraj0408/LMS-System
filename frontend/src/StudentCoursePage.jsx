import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./student.css";

const StudentCoursePage = () => {
  const { courseId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/student/course/${courseId}/materials`,
          { withCredentials: true }
        );
        setMaterials(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [courseId]);

  const notes = materials.filter(m => m.type === "notes");
  const links = materials.filter(m => m.type === "link");
  const videos = materials.filter(m => m.type === "youtube");
  const assignments = materials.filter(m => m.type === "assignment");

  if (loading) {
    return (
      <div className="fac">
        <h2>Course Materials</h2>
        <div className="loading-skeleton"></div>
        <div className="loading-skeleton"></div>
        <div className="loading-skeleton"></div>
      </div>
    );
  }

  return (
    <div className="fac">
      <h2>Course Materials</h2>

      <h3>📄 Notes</h3>
      {notes.length === 0 ? (
        <p style={{ color: 'var(--gray-light)', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
          No notes available yet
        </p>
      ) : (
        notes.map(n => (
          <div key={n._id}>
            <a
              href={`http://localhost:5000/${n.filePath}`}
              target="_blank"
              rel="noreferrer"
            >
              {n.title}
            </a>
          </div>
        ))
      )}

      <h3>🔗 Links</h3>
      {links.length === 0 ? (
        <p style={{ color: 'var(--gray-light)', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
          No links available yet
        </p>
      ) : (
        links.map(l => (
          <div key={l._id}>
            <a href={l.url} target="_blank" rel="noreferrer">
              {l.title}
            </a>
          </div>
        ))
      )}

      <h3>▶️ YouTube</h3>
      {videos.length === 0 ? (
        <p style={{ color: 'var(--gray-light)', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
          No videos available yet
        </p>
      ) : (
        videos.map(v => (
          <div key={v._id}>
            <a href={v.url} target="_blank" rel="noreferrer">
              {v.title}
            </a>
          </div>
        ))
      )}

      <h3>📝 Assignments</h3>
      {assignments.length === 0 ? (
        <p style={{ color: 'var(--gray-light)', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
          No assignments available yet
        </p>
      ) : (
        assignments.map(a => (
          <div key={a._id}>
            <span>{a.title}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentCoursePage;