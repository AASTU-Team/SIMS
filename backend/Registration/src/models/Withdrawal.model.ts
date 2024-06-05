import mongoose from "mongoose";

let withdrawalSchema = new mongoose.Schema({
    stud_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ['Student-Withdrawal', 'Department-Withdrawal', 'Registrar-withdrawal','Student-enroll', 'Department-enroll', 'Registrar-enroll', 'Rejected'],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    rejections: {
      by: {
        type: String,
        enum: ['Department', 'Registrar'],
        required: false,
      },
      reason: {
        type: String,
        required: false,
      },
      
    },
  });

module.exports = mongoose.models.withdrawal || mongoose.model("withdrawal", withdrawalSchema);