const express = require("express");
const cors = require("cors");
const studentModel = require("./mongo");
const cheerio = require("cheerio");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Grade = require("./gradeModel");
const app = express();
const Attendance = require("./attendanceModel");
const Quiz = require("./quizModel");
const QuizSubmission = require("./quizSubmissionModel");
const Enrollment = require("./enrollmentModel");
const multer = require("multer");
const path = require("path");
const Submission = require("./submissionModel");
const Course = require("./courseModel");
const Notification = require("./notoficationModel");
const Assignment = require("./assignmentModel");
const cookieParser = require("cookie-parser");
const e = require("express");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "piyushobroy87@gmail.com",   // your real Gmail
    pass: "wwpwlmwwrwqkuxia",      // 👈 paste app password here (no spaces)
  },
});



app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // 👈 allow cookies
  })
);
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");   // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// LeetCode API
async function fetchLeetCode(username) {
  const res = await axios.get(`https://alfa-leetcode-api.onrender.com/${username}/profile`);
  const data = res.data;
  console.log(data)

  return {
    solved: data.totalSolved || 0,
    rank: data.ranking ? data.ranking.toString() : "unranked",
    easysolved: data.easySolved || 0,
    mediumsolved: data.mediumSolved || 0,
    hardsolved: data.hardSolved || 0
  };
}



// codeforces API
async function fetchCodeforces(username) {
  const res = await axios.get(
    `https://codeforces.com/api/user.info?handles=${username}`
  );
  const user = res.data.result[0];

  return {
    rating: user.rating || 0,
    rank: user.rank || "unrated"
  };
}

async function fetchGithub(username) {
  const res = await axios.get(`https://api.github.com/users/${username}`);
  const data = res.data;
  return {
    repos: data.public_repos,
    followers: data.followers
  };
}

// ➕ UPLOAD PROFILE PICTURE
app.post(
  "/profile/upload-pic",
  verifyToken,
  authorize(["student"]),
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const user = await studentModel.findById(req.user.id);

      user.profilePic = req.file.path; // saved in uploads folder
      await user.save();

      // 👇 Send updated user back
      res.json({ message: "Profile picture updated", user });
    } catch (err) {
      res.status(500).json({ error: "Failed to upload profile picture" });
    }
  }
);


// ✏️ UPDATE BIO
app.put("/profile/update-bio", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const { bio } = req.body;

    const user = await studentModel.findById(req.user.id);
    user.about = bio;

    await user.save();
    res.json({ message: "Bio updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update bio" });
  }
});


// CodeChef does not have an official API; we will scrape the profile page
async function fetchCodechef(username) {
  const res = await axios.get(`https://www.codechef.com/users/${username}`);
  const $ = cheerio.load(res.data);

  const rating = $(".rating-number").first().text().trim();

  const solved = $(".rating-data-section")
    .find("h5")
    .first()
    .text()
    .match(/\d+/)?.[0];

  return {
    rating: Number(rating) || 0,
    solved: Number(solved) || 0,
    rank: "",                 // CodeChef page does not provide global rank here
    easysolved: 0,            // not available
    mediumsolved: 0,          // not available
    hardsolved: 0             // not available
  };
}


// Fetch platform data based on platform type
async function fetchPlatformData(platform, username) {
  switch (platform.toLowerCase()) {
    case "leetcode":
      return await fetchLeetCode(username);

    case "codeforces":
      return await fetchCodeforces(username);

    case "github":
      return await fetchGithub(username);

    case "codechef":
      return await fetchCodechef(username);

    default:
      throw new Error("Unsupported platform");
  }
}

// Calculate badges based on stats
function calculateBadges(stats) {
  const badges = [];

  if (stats.solved >= 100) badges.push("Bronze Coder");
  if (stats.solved >= 300) badges.push("Silver Coder");
  if (stats.solved >= 500) badges.push("Gold Coder");

  if (stats.rating >= 1800) badges.push("Expert");
  if (stats.rating >= 2000) badges.push("Master");

  return badges;
}

// ➕ ADD CODING PLATFORM
app.post("/profile/add-platform", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const { platform, username } = req.body;

    const user = await studentModel.findById(req.user.id);

    user.platforms.push({
      platform,
      username,
      lastSynced: new Date()
    });

    await user.save();

    res.json({ message: "Platform added", platforms: user.platforms });
  } catch (err) {
    res.status(500).json({ error: "Failed to add platform" });
  }
});

// 🔄 SYNC CODING PLATFORMS
app.post("/profile/sync-platforms", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const user = await studentModel.findById(req.user.id);

    for (let p of user.platforms) {
      const stats = await fetchPlatformData(p.platform, p.username);
      console.log("Fetched stats:", stats);
      if (p.platform.toLowerCase() === "github") {
        p.repos = stats.repos || 0;
        p.followers = stats.followers || 0;
      } else {
        p.stats = stats;
      }
      p.badges = calculateBadges(stats);
      p.lastSynced = new Date();
    }

    await user.save();

    res.json({ message: "Platforms synced", platforms: user.platforms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to sync platforms" });
  }
});

// 📖 GET MY PROFILE
app.get("/profile/me", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const user = await studentModel.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// 📖 STUDENT VIEW GRADES
app.get("/my-grades/:courseId", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const grades = await Grade.find({
      courseId: req.params.courseId,
      studentId: req.user.id,
    });

    res.json(grades);
  } catch (err) {
    console.error("Fetch grades error:", err);
    res.status(500).json({ error: "Failed to fetch grades" });
  }
});

// ➕ SUBMIT / UPDATE GRADE
app.post("/submit-grade", verifyToken, authorize(["faculty"]), upload.single("paper"), async (req, res) => {
  try {
    const { courseId, studentId, marks } = req.body;

    const filePath = req.file ? req.file.path : null;

    // Update if already graded
    const grade = await Grade.findOneAndUpdate(
      { courseId, studentId },
      {
        courseId,
        studentId,
        marks,
        paperFile: filePath,
        gradedBy: req.user.id,
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Grade submitted successfully", grade });
  } catch (err) {
    console.error("Submit grade error:", err);
    res.status(500).json({ error: "Failed to submit grade" });
  }
});


app.get("/my-attendance/:courseId", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const { courseId } = req.params;

    const attendance = await Attendance.find({
      courseId,
      studentId: req.user.id,
    }).sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    console.error("Fetch attendance error:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

// ➕ MARK ATTENDANCE
app.post("/mark-attendance", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const { courseId, records } = req.body;
    // records = [{ studentId, status }]

    const today = new Date();
    const date = today.toISOString().split("T")[0];
    const day = today.toLocaleDateString("en-US", { weekday: "long" });

    // Remove existing attendance for same course & date
    await Attendance.deleteMany({ courseId, date });

    const attendanceData = records.map((r) => ({
      courseId,
      studentId: r.studentId,
      status: r.status,
      date,
      day,
      markedBy: req.user.id,
    }));

    await Attendance.insertMany(attendanceData);

    res.json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.error("Mark attendance error:", err);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});
// ➕ CREATE QUIZ
app.post("/create-quiz", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const { title, courseId, questions } = req.body;

    const quiz = await Quiz.create({
      title,
      courseId,
      facultyId: req.user.id,
      questions,
    });

    res.json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ error: "Quiz creation failed" });
  }
});

// 📊 GET QUIZZES FOR A COURSE
app.get("/course-quizzes/:courseId", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check enrollment
    const enrolled = await Enrollment.findOne({
      courseId,
      studentId: req.user.id,
    });

    if (!enrolled) {
      return res.status(403).json({ error: "Not enrolled in this course" });
    }

    const quizzes = await Quiz.find({ courseId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// ➕ SUBMIT QUIZ
app.post("/submit-quiz", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    const submission = await QuizSubmission.create({
      quizId,
      studentId: req.user.id,
      answers,
      score,
    });

    res.json({ message: "Quiz submitted", score });
  } catch (err) {
    res.status(500).json({ error: "Quiz submission failed" });
  }
});

// 📊 GET QUIZ RESULTS FOR FACULTY
app.get("/quiz-results/:quizId", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const results = await QuizSubmission.find({ quizId: req.params.quizId })
      .populate("studentId", "name email");

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// 📊 GET FACULTY QUIZZES
app.get("/faculty-quizzes", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const quizzes = await Quiz.find({ facultyId: req.user.id });
    res.json(quizzes);
  } catch (err) {
    console.error("Fetch faculty quizzes error:", err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

//student details
app.get(
  "/student/details",
  verifyToken,
  authorize(["student"]),
  async (req, res) => {
    try {
      const studentUser = await studentModel
        .findOne({ _id: req.user.id })
        .select("-password");   // hide password

      if (!studentUser) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.status(200).json(studentUser);

    } catch (error) {
      console.error("Student Details Error:", error);
      return res.status(500).json({ error: "Cannot get the details" });
    }
  }
);

// 🔐 STUDENT LOGIN
app.post("/student-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await studentModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role }, // ✅ role from DB
      "your_jwt_secret",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({ message: "Login successful", role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔐 FACULTY LOGIN
app.post("/faculty-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    const user = await studentModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 2️⃣ Check role
    if (user.role !== "faculty") {
      return res.status(403).json({ error: "This is not a faculty account" });
    }

    // 3️⃣ Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 4️⃣ Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1d" }
    );

    // 5️⃣ Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,   // true only in https
      sameSite: "lax",
    });

    res.json({ message: "Faculty login successful" });

  } catch (error) {
    console.error("Faculty login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ➕ CREATE FACULTY
app.post("/create-faculty", verifyToken, authorize(["admin"]), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await studentModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFaculty = new studentModel({
      name,
      email,
      password: hashedPassword,
      role: "faculty",
    });

    await newFaculty.save();

    res.status(201).json({ message: "Faculty created successfully" });
  } catch (error) {
    console.error("Create faculty error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// ➕ CREATE STUDENT
app.post("/create-student", verifyToken, authorize(["admin"]), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await studentModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new studentModel({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    await newStudent.save();

    res.status(201).json({ message: "Student created successfully" });
  } catch (error) {
    console.error("Create student error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 📚 GET ALL COURSES
app.get("/all-courses", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const courses = await Course.find().populate("facultyId", "name email");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// 👩‍🎓 GET STUDENTS IN A COURSE
app.get("/course-students/:courseId", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const { courseId } = req.params;

    const students = await Enrollment.find({ courseId })
      .populate("studentId", "name email");

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});


function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function authorize(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}


// ➕ UPLOAD ASSIGNMENT SUBMISSION

// ✅ CHECK AUTH
app.get("/check-auth", verifyToken, (req, res) => {
  res.json({ loggedIn: true, user: req.user });
});

// 📩 FORGOT PASSWORD - SEND OTP
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const student = await studentModel.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Email not registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    student.resetOTP = otp;
    student.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await student.save();

    // 📩 Send email
    const mailOptions = {
      from: "piyushobroy87@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your OTP is:</p>
        <h1 style="color:blue;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent to your email" });

  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ error: "Failed to send OTP email" });
  }
});

// 🔁 RESET PASSWORD
app.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const student = await studentModel.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      student.resetOTP !== otp ||
      student.otpExpires < Date.now()
    ) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    student.resetOTP = null;
    student.otpExpires = null;

    await student.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ➕ CREATE COURSE
app.post(
  "/create-course",
  verifyToken,
  authorize(["faculty"]),
  upload.single("image"),   // 👈 image field name
  async (req, res) => {
    try {
      const { title, code, description } = req.body;

      const course = await Course.create({
        title,
        code,
        description,
        facultyId: req.user.id,
        image: req.file ? `/uploads/${req.file.filename}` : "",
      });

      res.json({ message: "Course created", course });
    } catch (err) {
      console.error("Create Course Error:", err);
      res.status(500).json({ error: "Course creation failed" });
    }
  }
);


// 📝 ENROLL IN COURSE
app.post("/enroll", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const { courseId } = req.body;

    const already = await Enrollment.findOne({
      studentId: req.user.id,
      courseId,
    });

    if (already) return res.status(400).json({ error: "Already enrolled" });

    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId,
    });

    res.json({ message: "Enrolled successfully", enrollment });
  } catch (err) {
    res.status(500).json({ error: "Enrollment failed" });
  }
});

// 📚 GET MY COURSES
app.get("/my-courses", verifyToken, authorize(["student"]), async (req, res) => {
  const courses = await Enrollment.find({ studentId: req.user.id })
    .populate("courseId");

  res.json(courses);
});

// 📚 GET FACULTY COURSES
app.get("/faculty-courses", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const courses = await Course.find({ facultyId: req.user.id });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

app.get("/student/recent-courses", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const studentCourses = await Course.find({ students: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json(studentCourses);
  } catch (err) {
    console.error("Course Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

app.get("/student/mycourses", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    const studentCourses = await Course.find({ students: req.user.id })
    res.json(studentCourses);
  } catch (err) {
    console.error("Course Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
})


app.get("/student/assignments", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    // 1️⃣ Find courses this student is enrolled in
    const courses = await Course.find({ students: req.user.id }).select("_id");
    const courseIds = courses.map(c => c._id);

    // 2️⃣ Find assignments for those courses
    const studentassignment = await Assignment.find({
      courseId: { $in: courseIds }
    })
      .sort({ createdAt: 1 })
      .limit(3);

    res.json(studentassignment);
  } catch (err) {
    console.error("Assignment Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});


// 🆕 GET RECENT COURSES CREATED BY FACULTY
app.get("/faculty/recent-courses", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const courses = await Course.find({ facultyId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// 🆕 GET RECENT ASSIGNMENTS CREATED BY FACULTY
app.get("/faculty/recent-assignments", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const assignments = await Assignment.find({ facultyId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("courseId", "title");

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

app.get("/student/notifications", verifyToken, authorize(["student"]), async (req, res) => {
  try{
    const noti = await Notification.find({studentId:req.user.id})
    .sort({createdAt:-1})
    .limit(3);
    res.json(noti);
  }catch(error){
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// 👩‍🎓 GET STUDENTS IN A COURSE
app.get("/course-students/:courseId", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const { courseId } = req.params;

    const students = await Enrollment.find({ courseId })
      .populate("studentId", "name email");

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// 📊 GET FACULTY ACHIEVEMENTS
app.get("/faculty/achievements", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({ facultyId: req.user.id });

    const enrollments = await Enrollment.find()
      .populate({
        path: "courseId",
        match: { facultyId: req.user.id }
      });

    const totalStudents = enrollments.filter(e => e.courseId !== null).length;

    const totalAssignments = await Assignment.countDocuments({ facultyId: req.user.id });

    res.json({
      totalCourses,
      totalStudents,
      totalAssignments
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
});

// ➕ ADD NOTIFICATION
app.post("/faculty/add-notification", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const { courseId, message } = req.body;

    const note = await Notification.create({
      message,
      courseId,
      facultyId: req.user.id
    });

    res.json({ message: "Notification added", note });
  } catch (err) {
    res.status(500).json({ error: "Failed to add notification" });
  }
});

// 🆕 GET RECENT NOTIFICATIONS FOR FACULTY
app.get("/faculty/notifications", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const notes = await Notification.find({ facultyId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("courseId", "title");

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// ➕ CREATE ASSIGNMENT
app.post("/create-assignment", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const { title, description, courseId, dueDate } = req.body;

    if (!title || !description || !courseId || !dueDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      courseId,
      facultyId: req.user.id,
      dueDate
    });

    res.json({ message: "Assignment created successfully", assignment });
  } catch (err) {
    console.error("Create assignment error:", err);
    res.status(500).json({ error: "Failed to create assignment" });
  }
});
// 📝 GET FACULTY ASSIGNMENTS
app.get("/faculty-assignments", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const assignments = await Assignment.find({ facultyId: req.user.id });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});


// 📝 GET MY ASSIGNMENTS
app.get("/my-assignments", verifyToken, authorize(["student"]), async (req, res) => {
  try {
    // 1️⃣ Get student's enrolled courses
    const enrollments = await Enrollment.find({ studentId: req.user.id });
    const courseIds = enrollments.map(e => e.courseId);

    // 2️⃣ Get assignments for those courses
    const assignments = await Assignment.find({ courseId: { $in: courseIds } })
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (err) {
    console.error("Fetch assignments error:", err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

// ➕ SUBMIT ASSIGNMENT
app.post(
  "/submit-assignment",
  verifyToken,
  authorize(["student"]),
  upload.single("file"),
  async (req, res) => {
    try {
      const { assignmentId } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const submission = await Submission.create({
        assignmentId,
        studentId: req.user.id,
        filePath: req.file.path,
      });

      res.json({ message: "Assignment submitted successfully", submission });
    } catch (err) {
      console.error("Submit error:", err);
      res.status(500).json({ error: "Failed to submit assignment" });
    }
  }
);

// ASSIGNMENT SUBMISSIONS FOR FACULTY
app.get("/assignment-submissions/:assignmentId", verifyToken, authorize(["faculty"]), async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
      .populate("studentId", "name email");

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
