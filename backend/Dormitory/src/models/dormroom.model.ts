import mongoose from "mongoose";

let dormroomSchema = new mongoose.Schema({
  room_number: {
    type: Number,
    required: false,
  },
  block: {
    type: String,
    required: false,
  },
  capaciy:{
    type: Number,
    required: false,

  }
});

module.exports = mongoose.models.Dormroom || mongoose.model("Dormroom", dormroomSchema);
