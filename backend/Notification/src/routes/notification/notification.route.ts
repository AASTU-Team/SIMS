import express from "express";
import {
  sendNotification,
  getNotificationById,
  deleteNotification,
  getNotificationByisRead,
  hi,
  trueNotification,
} from "./notification.controller";

const Notificationrouter = express.Router();

//Notificationrouter.post("/new", registerRoom);

Notificationrouter.post("/", sendNotification);
Notificationrouter.post("/true", trueNotification);
Notificationrouter.get("/notify", getNotificationByisRead);
Notificationrouter.get("/:id", getNotificationById);
Notificationrouter.delete("/:id", deleteNotification);

// Notificationrouter.get("/", getAllRooms);
// Notificationrouter.get("/:roomId", getRoomById);
// Notificationrouter.patch("/:roomId", updateRoom);
// Notificationrouter.delete("/:roomId", deleteRoom);

module.exports = Notificationrouter;
