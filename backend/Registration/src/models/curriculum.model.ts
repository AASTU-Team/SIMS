import mongoose from "mongoose";

let curriculumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Department",
  },
  credits_required: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: false,
  },
  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
      },
      semester: {
        type: Number
        required: true,
      },
  ],
  description: {
    type: String,
    required: false,
  },
});

module.exports =
  mongoose.models.Curriculum || mongoose.model("Curriculum", curriculumSchema);
