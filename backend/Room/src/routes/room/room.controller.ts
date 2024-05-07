import { Request, Response } from "express";
import mongoose from "mongoose";
const Room = require("../../models/Room.model");
const Joi = require("joi");

export const registerRoom = async (req: Request, res: Response) => {
  const data = req.body;
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const rooms = req.body.data;
    if (!rooms) {
      return res.status(400).send({ message: "data cant be empty" });
    }
    console.log(rooms);

    // Validate input data (using a library like Joi or Zod)
    const schema = Joi.array().items(
      Joi.object({
        room_number: Joi.number().optional(),
        block: Joi.string().optional(),
      })
    );

    const { error } = schema.validate(rooms);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Create an array of new room instances
    const newRooms = rooms.map((room: any) => new Room(room));

    // Save all rooms to the database using bulk insert (if available)
    const savedRooms = await Room.insertMany(newRooms);

    return res
      .status(201)
      .json({ message: "Rooms created successfully", rooms: savedRooms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find();
    return res.status(200).json({ rooms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({ room });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { room_number, block } = req.body;

    // Optional: Validate input data (using a library like Joi or Zod)

    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { room_number, block },
      { new: true } // Return the updated document
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res
      .status(200)
      .json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
