import mongoose from "mongoose";

let dormassignmentSchema = new mongoose.Schema({
  room_id: {
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Dormroom",
  },
  student_id: {
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Student"
  },

  assignment_date:{
    type: Date,
    required: false,

  }


});

module.exports = mongoose.models.Dormassignment || mongoose.model("Dormassignment", dormassignmentSchema);
