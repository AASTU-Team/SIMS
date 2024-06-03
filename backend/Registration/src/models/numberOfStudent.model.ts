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
  numberOfStudent: {
    type: mongoose.Schema.Types.Array,
    required: false,
    ref: "Student",
  },
});

module.exports =
  mongoose.models.NumberOfStudent ||
  mongoose.model("NumberOfStudent", numberOfStudentSchema);
