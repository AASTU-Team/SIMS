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
    department_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:"Department"
    },

})

module.exports = mongoose.models.AddStatus || mongoose.model("AddStatus", AddStatusSchema);