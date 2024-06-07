import mongoose from "mongoose";

let sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Department",
  },
  year: {
    type: Number,
    required: false,
  },
  semester: {
    type: Number,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});

module.exports =
  mongoose.models.Section || mongoose.model("Section", sectionSchema);
