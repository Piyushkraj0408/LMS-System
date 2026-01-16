const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/lms")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// 🌐 Coding Platform Schema
const platformSchema = new mongoose.Schema({
  platform: String,        // "LeetCode", "GitHub", "CodeChef"
  username: String,        // user handle
  stats: {
    solved: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    rank: String,
    easysolved: { type: Number, default: 0 },
    mediumsolved: { type: Number, default: 0 },
    hardsolved: { type: Number, default: 0 },
  },
  repos:{type: Number, default: 0},        // for GitHub
  followers:{type: Number, default: 0},    // for GitHub
  badges: [String],        // ["Knight", "Star Coder"]
  lastSynced: Date
});

// 👤 User Schema
const userSchema = mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["student", "faculty", "admin"],
    default: "student",
  },

  // 🔐 Auth
  resetOTP: String,
  otpExpires: Date,

  // 🖼 Profile Section
  profilePic: { type: String, default: "" },
  about: { type: String, default: "" },
  college: { type: String, default: "KIET GROUP OF INSTITUTE" },
  branch: { type: String, default: "CS" },
  year: { type: String, default: "2026" },

  // 🌐 Coding Platforms
  platforms: [platformSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);