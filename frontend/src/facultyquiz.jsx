import { useState, useEffect } from "react";
import axios from "axios";
import "./student.css";

export default function Facultyuquiz() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [quizzes, setQuizzes] = useState([]);

  // 🔄 Fetch faculty courses
  useEffect(() => {
    axios
      .get("http://localhost:5000/faculty-courses", { withCredentials: true })
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 🔄 Fetch quizzes created by faculty
  useEffect(() => {
    axios
      .get("http://localhost:5000/faculty-quizzes", { withCredentials: true })
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ➕ Add Question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  // 📊 Show Quiz Result
  const handleShowResult = async () => {
    if (!selectedQuizId) {
      alert("Please select a quiz first");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/quiz-results/${selectedQuizId}`,
        { withCredentials: true }
      );

      setQuizResults(res.data);
      alert("Quiz Results Fetched");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch quiz results");
    }
  };

  // 📝 Create Quiz
  const handleCreateQuiz = async () => {
    if (!title || !courseId || questions.length === 0) {
      alert("Please fill all fields and add at least one question");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/create-quiz",
        { title, courseId, questions },
        { withCredentials: true }
      );

      alert("Quiz Created!");
      setTitle("");
      setQuestions([]);

      // Save quiz ID and add to quiz list
      setSelectedQuizId(res.data.quiz._id);
      setQuizzes((prev) => [...prev, res.data.quiz]);
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    }
  };

  return (
    <div className="faculty-quiz-container">
      <h2>📝 Create Quiz</h2>

      <div className="quiz-form-section">
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        <button className="add-question-btn" onClick={addQuestion}>
          ➕ Add Question
        </button>

        {questions.map((q, i) => (
          <div key={i} className="question-card">
            <input
              type="text"
              placeholder={`Question ${i + 1}`}
              value={q.question}
              onChange={(e) => {
                const newQ = [...questions];
                newQ[i].question = e.target.value;
                setQuestions(newQ);
              }}
            />

            <div className="options-grid">
              {q.options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[i].options[idx] = e.target.value;
                    setQuestions(newQ);
                  }}
                />
              ))}
            </div>

            <select
              value={q.correctAnswer}
              onChange={(e) => {
                const newQ = [...questions];
                newQ[i].correctAnswer = Number(e.target.value);
                setQuestions(newQ);
              }}
            >
              <option value="0">✓ Correct Answer: Option 1</option>
              <option value="1">✓ Correct Answer: Option 2</option>
              <option value="2">✓ Correct Answer: Option 3</option>
              <option value="3">✓ Correct Answer: Option 4</option>
            </select>
          </div>
        ))}

        <button className="create-quiz-btn" onClick={handleCreateQuiz}>
          Create Quiz
        </button>
      </div>

      <hr className="quiz-divider" />

      <h3>📊 View Quiz Results</h3>

      <div className="results-section">
        <select
          value={selectedQuizId}
          onChange={(e) => setSelectedQuizId(e.target.value)}
        >
          <option value="">Select Quiz</option>
          {quizzes.map((q) => (
            <option key={q._id} value={q._id}>
              {q.title}
            </option>
          ))}
        </select>

        <button className="show-result-btn" onClick={handleShowResult}>
          Show Results
        </button>

        {quizResults && (
          <div>
            {quizResults.length === 0 ? (
              <p>No submissions yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((r) => (
                    <tr key={r._id}>
                      <td>{r.studentId?.name || "N/A"}</td>
                      <td>{r.studentId?.email || "N/A"}</td>
                      <td>{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}