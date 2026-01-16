const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [Number],
  score: Number,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QuizSubmission", quizSubmissionSchema);
