import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true
  },
  term_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Term", // Assuming there's a Term model that includes semester and academic year
    required: true
  },
  grade: {
    type: String,
    required: true,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'F', 'NG'] // Full range of grades including Incomplete, Withdrawn, and Non-Gradable
  },
  remark: {
    type: String,
    required: false
  },
  modified: {
    type: Date,
    default: Date.now
  }
});

const Grade = mongoose.models.Grade || mongoose.model("Grade", gradeSchema);
export default Grade;