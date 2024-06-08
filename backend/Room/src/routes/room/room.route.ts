import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  createRooms,
} from "./room.controller";

const Roomrouter = express.Router();

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create new rooms
 *     description: Create one or more new rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Room'
 *     responses:
 *       '201':
 *         description: Rooms created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 rooms:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         room_number:
 *           type: number
 *         block:
 *           type: string
 *         type:
 *           type: string
 */
Roomrouter.post("/", createRoom);
Roomrouter.post("/createRooms", createRooms);
Roomrouter.get("/", getAllRooms);
// Roomrouter.get('/available' , getAvailableRooms)
Roomrouter.get("/:roomId", getRoomById);
Roomrouter.patch("/:roomId", updateRoom);
Roomrouter.delete("/:roomId", deleteRoom);
// Request Room
// Roomrouter.post('/request');
// Roomrouter.get('/available');
// Roomrouter.post('/assign/:id')

module.exports = Roomrouter;
