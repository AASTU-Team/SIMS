import { head } from "app";
import { required } from "joi";
import mongoose from "mongoose";

let departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required:false,
  },
  dep_head: { type: mongoose.Types.ObjectId, required: false, ref: "staff" },
});

module.exports =
  mongoose.models.Department || mongoose.model("Department", departmentSchema);
