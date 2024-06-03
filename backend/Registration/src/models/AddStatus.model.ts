import mongoose from "mongoose";

let AddStatusSchema  = new mongoose.Schema({
    status:{
        type: Boolean,
        required: true
    
    },

    year:{
        type:Number,
        required:true
    },
    semester:{
        type:Number,
        required:true

    },
    type: {
        type: String,
        enum: ["Undergraduate", "Masters"],
        required: false,
      },
    department_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:"Department"
    },

})

module.exports = mongoose.models.AddStatus || mongoose.model("AddStatus", AddStatusSchema);