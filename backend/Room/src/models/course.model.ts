import mongoose from "mongoose";

let courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Department",
  },
  instructors: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    required: false,
    ref: "Staff",
  },
  credits: {
    type: Number,
    required: true,
    default: 0,
  },
  prerequisites: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    required: true,
    ref: "Course",
  },
  type: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  lec: {
    type: String,
    required: true,
  },
  lab: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports =
  mongoose.models.Course || mongoose.model("Course", courseSchema);
