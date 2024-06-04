import mongoose from "mongoose";

let SemesterSchema  = new mongoose.Schema({
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
        required: true,
      },
  

})

module.exports = mongoose.models.Semester || mongoose.model("ActiveSemester",SemesterSchema);