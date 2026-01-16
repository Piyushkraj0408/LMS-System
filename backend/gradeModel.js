const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  marks: { type: Number, required: true },
  paperFile: { type: String }, // file path
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // faculty
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Grade", gradeSchema);
