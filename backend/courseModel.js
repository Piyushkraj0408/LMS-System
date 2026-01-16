const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  title: String,
  code: String,
  description: String,

  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  image: {
    type: String,   // stores file path or URL
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
