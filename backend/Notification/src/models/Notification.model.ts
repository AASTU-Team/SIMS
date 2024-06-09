import mongoose from "mongoose";

let notificationSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Event",
  },
  srecipient: {
    type: Array<String>,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  date_sent: Date,
  type: {
    type: String,
  },
});

module.exports =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
