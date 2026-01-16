// notificationModel.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
