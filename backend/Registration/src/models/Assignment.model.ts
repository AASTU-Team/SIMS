import mongoose from "mongoose";

let assignmentSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Course",
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Staff",
  },
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Section",
  },
  Lab_Lec: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
  semester: {
    type: Number,
    required: false,
  },
});

module.exports =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
