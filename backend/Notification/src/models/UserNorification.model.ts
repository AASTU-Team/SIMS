import mongoose from "mongoose";

let userNotificationSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
    unique: true,
  },
  notifications: [
    {
      notification_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Notification",
      },
      isRead: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports =
  mongoose.models.UserNotification ||
  mongoose.model("UserNotification", userNotificationSchema);
