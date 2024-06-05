import mongoose from "mongoose";

let AddStatusSchema  = new mongoose.Schema({
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

module.exports = mongoose.models.AddStatus || mongoose.model("AddStatus", AddStatusSchema);