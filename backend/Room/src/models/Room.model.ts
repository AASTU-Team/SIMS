import mongoose from "mongoose";

let roomSchema = new mongoose.Schema({
  room_number: {
    type: Number,
    required: false,
  },
  block: {
    type: String,
    required: false,
  }

});

module.exports =
  mongoose.models.Room || mongoose.model("Room", roomSchema);
