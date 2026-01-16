const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // e.g. 2026-01-15
  day: { type: String, required: true },  // e.g. Monday
  status: { type: String, enum: ["Present", "Absent"], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // faculty
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
