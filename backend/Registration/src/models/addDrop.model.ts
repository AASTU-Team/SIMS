import mongoose from "mongoose";

let addDropSchema = new mongoose.Schema({
  stud_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Student",
  },
  courseToAdd: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    required: false,
    ref: "Course",
  },
  courseToDrop: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    required: false,
    ref: "Course",
  },
  courseToAddWithSec: [
    {
      course_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Course",
      },
      section_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Section",
      },
    },
  ],
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Department",
  },
  status: {
    type: String,
    required: false,
    default: "pending",
  },
  reason: {
    type: String,
    required: false,
    default: "",
  },
  registrarStatus: {
    type: String,
    required: false,
    default: "pending",
  },
  registrarReason: {
    type: String,
    required: false,
    default: "",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.AddDrop || mongoose.model("AddDrop", addDropSchema);
