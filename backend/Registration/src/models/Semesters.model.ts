import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
   
    batches: {
      type: [Number],
      required: true,
    },
    program:  {
        type: String,
        enum: ["Undergraduate", "Masters"],
        required: true,
      },
    semester: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: false,
    },
    end_date: {
      type: Date,
      required: false,
    },
    academic_year: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      required: true,
    },
  });

module.exports = mongoose.models.Semester || mongoose.model("Semester",semesterSchema);