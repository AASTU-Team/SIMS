import mongoose from "mongoose";

let departmentSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:false
    },

    description:{
        type:String,
        required:false,
        
        
    }

})

module.exports = mongoose.models.Department || mongoose.model("Department", departmentSchema);