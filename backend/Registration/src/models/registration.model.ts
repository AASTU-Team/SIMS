import mongoose from "mongoose";

let registrationSchema  = new mongoose.Schema({
    stud_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:false
    },

    section_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        required:false
    },
    courses:{
        type:Array,
        required:false
    },
    registration_date:{
        type:Date,
        required:false
    }


})

module.exports = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);