const mongoose = require("mongoose");

const courseMaterialSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  title: String,

  type: {
    type: String,
    enum: ["notes", "link", "youtube", "assignment"],
    required: true,
  },

  // For notes / assignment file
  filePath: {
    type: String,
    default: "",
  },

  // For link / youtube
  url: {
    type: String,
    default: "",
  },

  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CourseMaterial", courseMaterialSchema);
