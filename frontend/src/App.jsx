import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import RoleSelect from "./roleselect";
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
import FacultyMyCourses from "./facultymycourse";
import Exam from "./exam";
import FacultyCoursePage from "./facultycoursepage";
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
import StudentCoursePage from "./StudentCoursePage";

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><RoleSelect /></PageTransition>} />
        
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        
        <Route path="/facultyAuth" element={<PageTransition><FacultyAuth /></PageTransition>} />

        {/* 🔒 FACULTY PROTECTED */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute role="faculty">
              <Faculty />
            </ProtectedRoute>
          }
        >
          <Route index element={<PageTransition><FacultyDash /></PageTransition>} />
          <Route path="dashboard" element={<PageTransition><FacultyDash /></PageTransition>} />
          <Route path="courses" element={<PageTransition><FacultyCourse /></PageTransition>} />
          <Route path="my-courses" element={<PageTransition><FacultyMyCourses /></PageTransition>} />
          <Route path="course/:courseId" element={<PageTransition><FacultyCoursePage /></PageTransition>} />
          <Route path="assignment" element={<PageTransition><FacultyAssignment /></PageTransition>} />
          <Route path="quiz" element={<PageTransition><Facultyuquiz /></PageTransition>} />
          <Route path="attendance" element={<PageTransition><Facultyattendence /></PageTransition>} />
          <Route path="grade" element={<PageTransition><Facultygrade /></PageTransition>} />
          <Route path="exam" element={<PageTransition><Facultyexam /></PageTransition>} />
          <Route path="mystudents" element={<PageTransition><Facultystudent /></PageTransition>} />
        </Route>

        <Route path="/studentauth" element={<PageTransition><StudentAuth /></PageTransition>} />

        {/* 🔒 STUDENT PROTECTED */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <Student />
            </ProtectedRoute>
          }
        >
          <Route index element={<PageTransition><Dash /></PageTransition>} />
          <Route path="dashboard" element={<PageTransition><Dash /></PageTransition>} />
          <Route path="courses" element={<PageTransition><Courses /></PageTransition>} />
          <Route path="profile" element={<PageTransition><StudentProfile /></PageTransition>} />
          <Route path="mycourses" element={<PageTransition><Studentmycourses /></PageTransition>} />
          <Route path="course/:courseId" element={<PageTransition><StudentCoursePage /></PageTransition>} />
          <Route path="quiz" element={<PageTransition><Quiz /></PageTransition>} />
          <Route path="quizzes/:courseId" element={<PageTransition><StudentQuiz /></PageTransition>} />
          <Route path="assignment" element={<PageTransition><Assignment /></PageTransition>} />
          <Route path="attendance" element={<PageTransition><Attendeance /></PageTransition>} />
          <Route path="attendance/:courseId" element={<PageTransition><StudentAttendance /></PageTransition>} />
          <Route path="grade" element={<PageTransition><Grade /></PageTransition>} />
          <Route path="grade/:courseId" element={<PageTransition><StudentGrade /></PageTransition>} />
          <Route path="exam" element={<PageTransition><Exam /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

// 🎨 Reusable Animation Component
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};