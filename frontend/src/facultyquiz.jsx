import { useState, useEffect } from "react";
import axios from "axios";

export default function Facultyuquiz() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [quizzes, setQuizzes] = useState([]); // 👈 STORE FACULTY QUIZZES

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

  // 📊 SHOW QUIZ RESULT
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

  // 📝 CREATE QUIZ
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

      // 👇 SAVE QUIZ ID AND ADD TO QUIZ LIST
      setSelectedQuizId(res.data.quiz._id);
      setQuizzes((prev) => [...prev, res.data.quiz]);
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz");
    }
  };

  return (
    <div>
      <h2>Create Quiz</h2>

      <input
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

      <button onClick={addQuestion}>Add Question</button>

      {questions.map((q, i) => (
        <div key={i}>
          <input
            placeholder="Question"
            value={q.question}
            onChange={(e) => {
              const newQ = [...questions];
              newQ[i].question = e.target.value;
              setQuestions(newQ);
            }}
          />

          {q.options.map((opt, idx) => (
            <input
              key={idx}
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => {
                const newQ = [...questions];
                newQ[i].options[idx] = e.target.value;
                setQuestions(newQ);
              }}
            />
          ))}

          <select
            value={q.correctAnswer}
            onChange={(e) => {
              const newQ = [...questions];
              newQ[i].correctAnswer = Number(e.target.value);
              setQuestions(newQ);
            }}
          >
            <option value="0">Correct: 1</option>
            <option value="1">Correct: 2</option>
            <option value="2">Correct: 3</option>
            <option value="3">Correct: 4</option>
          </select>
        </div>
      ))}

      <button onClick={handleCreateQuiz}>Create Quiz</button>

      {/* 🔽 SELECT QUIZ FOR RESULTS */}
      <h3 style={{ marginTop: "30px" }}>View Quiz Results</h3>

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

      <button onClick={handleShowResult}>Show Result</button>

      {/* 📊 DISPLAY RESULTS */}
      {quizResults && (
        <div style={{ marginTop: "20px" }}>
          <h3>Quiz Results</h3>

          {quizResults.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {quizResults.map((r) => (
                  <tr key={r._id}>
                    <td>{r.studentId?.name}</td>
                    <td>{r.studentId?.email}</td>
                    <td>{r.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
