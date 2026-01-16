import { Routes, Route } from "react-router-dom";
import RoleSelect from "./RoleSelect";
import StudentAuth from "./studentauth";
import Student from "./student";
import Dash from "./dashboard";
import Courses from "./courses";
import Assignment from "./assignment";
import Quiz from "./quiz";
import StudentAttendance from "./studentAttendence";
import Grade from "./grade";
import StudentGrade from "./StudentGrade";
import StudentQuiz from "./studentQuiz";
import Exam from "./exam";
import Attendeance from "./attendance";
import FacultyAuth from "./facultyAuth";
import Faculty from "./faculty";
import FacultyDash from "./facultyDash";
import FacultyCourse from "./facultyCourse";
import FacultyAssignment from "./facultyassignment";
import Facultyuquiz from "./facultyquiz";
import Facultyattendence from "./facultyattendence";
import Facultygrade from "./facultygrade";
import Facultyexam from "./facultyexam";
import Facultystudent from "./facultystudent";
import Admin from "./admin";
import ProtectedRoute from "./protectedRoute";
import StudentProfile from "./profile";
import Studentmycourses from "./studentmycourses";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelect />} />

      <Route path="/admin" element={<Admin />} />

      <Route path="/facultyAuth" element={<FacultyAuth />} />

      {/* 🔒 FACULTY PROTECTED */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute role="faculty">
            <Faculty />
          </ProtectedRoute>
        }
      >
        <Route index element={<FacultyDash />} />
        <Route path="dashboard" element={<FacultyDash />} />
        <Route path="courses" element={<FacultyCourse />} />
        <Route path="assignment" element={<FacultyAssignment />} />
        <Route path="quiz" element={<Facultyuquiz />} />
        <Route path="attendance" element={<Facultyattendence />} />
        <Route path="grade" element={<Facultygrade />} />
        <Route path="exam" element={<Facultyexam />} />
        <Route path="mystudents" element={<Facultystudent />} />
      </Route>

      <Route path="/studentauth" element={<StudentAuth />} />

      {/* 🔒 STUDENT PROTECTED */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <Student />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dash />} />
        <Route path="dashboard" element={<Dash />} />
        <Route path="courses" element={<Courses />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="mycourses" element={<Studentmycourses />} />

        {/* ✅ QUIZ ROUTES */}
        <Route path="quiz" element={<Quiz />} />
        <Route path="quizzes/:courseId" element={<StudentQuiz />} />

        <Route path="assignment" element={<Assignment />} />

        {/* ✅ ATTENDANCE ROUTES */}
        <Route path="attendance" element={<Attendeance />} />
        <Route path="attendance/:courseId" element={<StudentAttendance />} />

        <Route path="grade" element={<Grade />} />
        <Route path="grade/:courseId" element={<StudentGrade />} />
        <Route path="exam" element={<Exam />} />
      </Route>
    </Routes>
  );
}
