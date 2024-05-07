import mongoose from "mongoose";

let sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
  semester: {
    type: Number,
    required: false,
  },

  assignment_ids: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Assignment",
  },
});

module.exports =
  mongoose.models.Section || mongoose.model("Section", sectionSchema);
