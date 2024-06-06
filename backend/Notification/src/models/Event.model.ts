import mongoose from "mongoose";

let eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  event_type: {
    type: String,
    required: false,
  },
  Room: { type: mongoose.Types.ObjectId, required: false, ref: "Room" },
  description: {
    type: String,
    required: false,
  },
  date_start: Date,
  date_end: Date,
  organizer: { type: mongoose.Types.ObjectId, required: false },
  guest_speakers: { type: String, required: false },
  is_public: { type: Boolean, required: false },
  status: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
