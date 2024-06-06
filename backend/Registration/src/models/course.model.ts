import mongoose from "mongoose";
const assessmentsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  value: {
    type: Number
  }
});

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
    type: Number,
    required: true,
  },
  lab: {
    type: Number,
    required: true,
  },
  tut: {
    type: Number,
    required: true,
  },
  hs: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
  assessments: {
    type: [assessmentsSchema]
  },
  maxNumberOfStudents: Number,

});

module.exports =
  mongoose.models.Course || mongoose.model("Course", courseSchema);
