import mongoose from "mongoose";

let RegistrationstatusSchema  = new mongoose.Schema({
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        required: true,
      },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Semester",
      }

})

module.exports = mongoose.models.RegistrationStatus || mongoose.model("RegistrationStatus", RegistrationstatusSchema);