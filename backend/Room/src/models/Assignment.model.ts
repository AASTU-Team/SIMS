import mongoose from "mongoose";

let assignmentSchema  = new mongoose.Schema({
    course_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Course",
    },

    instructor_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Staff",
    },
    room_number:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Room",
    },
    start_time:{
        type:String,
        required:false
    },
    end_time:{
        type:String,
        required:false
    },
    Lab_Lec:{
        type:String,
        required:false
    }

})

module.exports = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);