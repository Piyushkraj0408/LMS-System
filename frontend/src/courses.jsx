import "./student.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/all-courses", {
          withCredentials: true,
        });
        setCourses(res.data);
      } catch (err) {
        console.log(err);
        setMessage("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/enroll",
        { courseId },
        { withCredentials: true }
      );
      alert(res.data.message || "Enrolled successfully");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Enrollment failed");
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? courses.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === courses.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="courses">
        <h2>Available Courses</h2>
        <div className="empty-state">
          <p>📚 No courses available at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses">
      <h2 style={{color:"white !important"}}>Available Courses</h2>

      {message && <p className="error-message">{message}</p>}

      <div className="course-carousel">
        <div className="course-grid">
          {courses.map((course, index) => {
            // Calculate position relative to current index
            let position = index - currentIndex;
            
            // Handle wraparound for smooth infinite scroll
            if (position < -1) position = courses.length + position;
            if (position > 1) position = position - courses.length;
            
            // Only render cards that are visible (-1, 0, 1)
            if (Math.abs(position) > 1) return null;
            
            return (
              <div
                className={`course-card ${position === 0 ? 'active' : ''}`}
                key={course._id}
                style={{
                  transform: `translateX(${position * 110}%) scale(${position === 0 ? 1 : 0.85})`,
                  zIndex: position === 0 ? 10 : 1,
                }}
                onClick={() => position !== 0 && setCurrentIndex(index)}
              >
                <h3>{course.title}</h3>
                <p><b>Code:</b> {course.code}</p>
                <p className="description">{course.description}</p>

                {course.facultyId && (
                  <p><b>Faculty:</b> {course.facultyId.name}</p>
                )}

                <button onClick={() => handleEnroll(course._id)}>
                  Enroll Now
                </button>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        {courses.length > 1 && (
          <div className="carousel-nav">
            <button 
              className="carousel-btn carousel-btn-prev" 
              onClick={handlePrev}
              aria-label="Previous course"
            >
              ‹
            </button>
            <button 
              className="carousel-btn carousel-btn-next" 
              onClick={handleNext}
              aria-label="Next course"
            >
              ›
            </button>
          </div>
        )}

        {/* Dots Indicator */}
        {courses.length > 1 && (
          <div className="carousel-dots">
            {courses.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                role="button"
                aria-label={`Go to course ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}