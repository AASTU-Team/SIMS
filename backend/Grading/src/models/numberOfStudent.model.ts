import { required } from "joi";
import mongoose from "mongoose";

let numberOfStudentSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Course",
  },
  section_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Section",
  },
  numberOfStudent: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Student",
      },
      isOutOfBatch: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports =
  mongoose.models.NumberOfStudent ||
  mongoose.model("NumberOfStudent", numberOfStudentSchema);
