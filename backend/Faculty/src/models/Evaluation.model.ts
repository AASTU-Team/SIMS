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
    type: Date,
    default: Date.now(),
    required: false,
  },
  professionalism: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 5,
  },
  knowledge: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 5,
  },
  communication: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 5,
  },
  organization: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 5,
  },
  responsiveness: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 5,
  },
  teaching_style: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 5,
  },
  interaction: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 5,
  },
  preparedness: {
    type: Number,
    required: true,
    default: 1,
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
  expires_at: {
    type: Date,
    required: true,
    default: Date.now() + 7 * 24 * 60 * 60 * 1000, // expires after 7 days
  },
});

const InstructorEvaluation = mongoose.model(
  "InstructorEvaluation",
  instructorEvaluationSchema
);

module.exports = InstructorEvaluation;
