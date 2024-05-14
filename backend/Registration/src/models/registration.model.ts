import mongoose from "mongoose";

let registrationSchema = new mongoose.Schema({
  stud_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: false,
  },

  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: false,
  },
  year: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  total_credit: {
    type: Number,
    required: false,
  },
  courses: [
    {
      courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      grade: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: ["Active", "Completed", "Dropped"],
        required: true,
      },
      isRetake: {
        type: Boolean,
        required: true,
      },
    },
  ],
  registration_date: {
    type: Date,
    required: false,
  },
});

module.exports =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);
