import { head } from "app";
import mongoose from "mongoose";

let departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },

  description: {
    type: String,
  },
  dep_head: { type: mongoose.Types.ObjectId, required: false, ref: "staff" },
});

module.exports =
  mongoose.models.Department || mongoose.model("Department", departmentSchema);
