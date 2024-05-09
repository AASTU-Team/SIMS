import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  createRooms
} from "./room.controller";

const Roomrouter = express.Router();

//Roomrouter.post("/new", registerRoom);

Roomrouter.post("/", createRoom);
Roomrouter.post("/createRooms", createRooms);
Roomrouter.get("/", getAllRooms);
Roomrouter.get("/:roomId", getRoomById);
Roomrouter.patch("/:roomId", updateRoom);
Roomrouter.delete("/:roomId", deleteRoom);

module.exports = Roomrouter;
