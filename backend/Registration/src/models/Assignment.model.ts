import mongoose from "mongoose";

let assignmentSchema  = new mongoose.Schema({
    course_id:{
        type:String,
        required:false
    },

    instructor_id:{
        type:String,
        required:false
    },
    room_number:{
        type:String,
        required:false
    },
    start_time:{
        type:Date,
        required:false
    },
    end_time:{
        type:Date,
        required:false
    },
    Lab_Lec:{
        type:String,
        required:false
    }

})

module.exports = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);