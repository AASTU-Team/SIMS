import mongoose from "mongoose";

const meetingTimeSchema = new mongoose.Schema({
    id: String,
    time: String,
  });

  module.exports = mongoose.models.MeetingTime || mongoose.model("Room", meetingTimeSchema);
