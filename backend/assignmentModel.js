const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Assignment", assignmentSchema);
