import mongoose from "mongoose";

let addDropSchema = new mongoose.Schema({
  stud_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  courseToAdd: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    required: false,
    ref: "Course",
  },
  courseToDrop: {
    type: Array<mongoose.Schema.Types.ObjectId>,
    required: false,
    ref: "Course",
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Department",
  },
  status: {
    type: String,
    required: false,
    default: "pending",
  },
  reason: {
    type: String,
    required: false,
    default: "",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.AddDrop || mongoose.model("AddDrop", addDropSchema);
