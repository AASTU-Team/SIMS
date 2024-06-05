import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    optional: true
  },
  max_score: {
    type: Number,
    required: true
  },
  due_date: {
    type: Date,
    optional: true
  },
  is_submittable: {
    type: Boolean,
    required: true,
    default: false
  },
  creation_date: {
    type: Date,
    default: Date.now
  }
});

const Assessment = mongoose.models.Assessment || mongoose.model("Assessment", assessmentSchema);
export default Assessment;