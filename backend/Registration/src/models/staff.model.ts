import mongoose from "mongoose";

let staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Department",
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["MALE", "FEMALE"],
    required: true,
  },
  isInstructor: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.models.Staff || mongoose.model("Staff", staffSchema);
