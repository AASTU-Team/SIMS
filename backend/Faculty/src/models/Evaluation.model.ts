import mongoose from "mongoose";

const instructorEvaluationSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Staff",
  },
  start_time: {
    type: String,
    required: false,
  },
  professionalism: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  knowledge: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  communication: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  organization: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  responsiveness: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  teaching_style: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  interaction: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  preparedness: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comments: {
    type: String,
    required: false,
  },
  evaluated_by_students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const InstructorEvaluation = mongoose.model(
  "InstructorEvaluation",
  instructorEvaluationSchema
);

module.exports = InstructorEvaluation;
