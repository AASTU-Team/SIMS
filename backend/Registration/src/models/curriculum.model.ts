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
  semester: {
   type: Number,
    required: true,
      },
  courses: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    required: true,
    ref: "Course",
  },
  description: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["Undergraduate", "Masters","PhD"],
    required: false,
  },
});

module.exports =
  mongoose.models.Curriculum || mongoose.model("Curriculum", curriculumSchema);
