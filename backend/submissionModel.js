const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filePath: String,
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", submissionSchema);
