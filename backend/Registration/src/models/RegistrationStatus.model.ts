import mongoose from "mongoose";

let RegistrationstatusSchema  = new mongoose.Schema({
    status:{
        type: Boolean,
        required: true
    
    },
    semester: {
        type: Array<mongoose.Schema.Types.ObjectId>,
        required: false,
        ref: "Semester",
      }

})

module.exports = mongoose.models.RegistrationStatus || mongoose.model("RegistrationStatus", RegistrationstatusSchema);