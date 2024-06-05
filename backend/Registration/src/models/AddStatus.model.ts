import mongoose from "mongoose";

let AddStatusSchema  = new mongoose.Schema({
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

module.exports = mongoose.models.AddStatus || mongoose.model("AddStatus", AddStatusSchema);