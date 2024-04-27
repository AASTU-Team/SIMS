import mongoose from "mongoose";

let statusSchema  = new mongoose.Schema({
    status:{
        type: String,
        enum: ['Active', 'withdrawn','graduated','banned'],
        required: false
    
    },

    description:{
        type:String,
        required:false
    }

})

module.exports = mongoose.models.Status || mongoose.model("Status", statusSchema);