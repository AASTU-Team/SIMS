import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema({
   
    batches: {
      type: [String],
      required: true,
    },
    program:  {
        type: String,
        enum: ["Undergraduate", "Masters","PhD"],
        required: true,
      },
    semester: {
      type: String,
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
      type: String,
      enum: ["Active", "Inactive"],
      required: true,
    },
  });

module.exports = mongoose.models.Semester || mongoose.model("Semester",semesterSchema);