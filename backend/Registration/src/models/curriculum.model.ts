import mongoose from "mongoose";

let curriculumSchema  = new mongoose.Schema({

    name:{
        type:String,
        required:false
    },

    department_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,
        ref:"Department"
    },

    credits_required:{
        type:Number,
        required:false
    },
    semester:{
        type:String,
        required:false
    },
    year:{
        type:Date,
        required:false
    },
    courses:{
        type:Array<mongoose.Schema.Types.ObjectId>,
        required:false,
        ref:"Course"
        
    },
    description:{
        type:String,
        required:false
    }


})

module.exports = mongoose.models.Curriculum || mongoose.model("Curriculum", curriculumSchema);