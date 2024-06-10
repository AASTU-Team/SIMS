import mongoose from "mongoose";

let instructorAssignmentSchema = new mongoose.Schema({
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Staff",
  },
  assigned: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Staff",
  },
  date: {
    type: Date,
    required: false,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Course",
  },
  Lab_Lec: {
    type: String,
    required: false,
  },
});

module.exports =
  mongoose.models.InstructorAssignment ||
  mongoose.model("InstructorAssignment", instructorAssignmentSchema);
