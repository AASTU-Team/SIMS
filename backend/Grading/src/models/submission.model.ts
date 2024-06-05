import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  assessment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  submission_date: {
    type: Date,
    required: false
  },
  file_path: {
    type: String,
    required: false
  },
  score: {
    type: Number,
    required: false
  },
  remark: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ['Submitted', 'Late', 'Missing', 'Exempt'],
    default: 'Missing'
  }
});

const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
export default Submission;