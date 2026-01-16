const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number, // index of correct option
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
