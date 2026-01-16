import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function StudentQuiz() {
  const { courseId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!courseId) return;

    axios
      .get(`http://localhost:5000/course-quizzes/${courseId}`, {
        withCredentials: true,
      })
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.log(err));
  }, [courseId]);

  const submitQuiz = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/submit-quiz",
        { quizId: selectedQuiz._id, answers },
        { withCredentials: true }
      );
      alert("Score: " + res.data.score);
      setSelectedQuiz(null);
      setAnswers([]);
    } catch (err) {
      alert("Quiz submission failed");
    }
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const totalQuestions = selectedQuiz?.questions.length || 0;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="quiz-page">
      <h2>Course Quizzes</h2>

      {quizzes.length === 0 ? (
        <p>No quizzes available for this course.</p>
      ) : (
        !selectedQuiz && quizzes.map((q) => (
          <button
            key={q._id}
            onClick={() => {
              setSelectedQuiz(q);
              setAnswers(new Array(q.questions.length).fill(null));
            }}
          >
            {q.title}
          </button>
        ))
      )}

      {selectedQuiz && (
        <div className="quiz-box">
          {/* Progress Bar */}
          <div className="quiz-progress">
            <span style={{ fontSize: '0.9rem', color: 'var(--gray-light)' }}>
              Progress: {answeredCount}/{totalQuestions}
            </span>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--active-bg)' }}>
              {Math.round(progress)}%
            </span>
          </div>

          <h3>{selectedQuiz.title}</h3>

          {selectedQuiz.questions.map((q, i) => (
            <div key={i}>
              <p>{q.question}</p>
              {q.options.map((opt, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    checked={answers[i] === idx}
                    onChange={() => {
                      const newAns = [...answers];
                      newAns[i] = idx;
                      setAnswers(newAns);
                    }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          ))}

          <button onClick={submitQuiz} disabled={answeredCount !== totalQuestions}>
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
}