import { Request, Response } from "express";
import mongoose from "mongoose";
const Notification = require("../../models/Notification.model");
const UserNotification = require("../../models/UserNorification.model");
import { io } from "../../server";
const Joi = require("joi");

export const hi = async (req: Request, res: Response) => {
  io.emit("registrarion", "hi");
  res.send("hi");
};

export const sendNotification = async (req: Request, res: Response) => {
  const data = req.body.data;
  const { name, dept_id, stud_id } = req.body;
  //list of students from the data base using dept id

  try {
    const notification = await Notification.create(data);
    await notification.save();
    if (dept_id) {
      io.to(name + dept_id).emit("registrarion", notification);
    } else if (stud_id) {
      io.to(stud_id).emit("privatedata", notification);
    }
    console.log(notification, data);
    const norify = await Promise.all(
      data.srecipient.map(async (data: String) => {
        console.log(data);
        const user = await UserNotification.findOne({ user_id: data });
        console.log(user);
        if (user) {
          user.notifications.push({
            notification_id: notification._id,
            isRead: false,
          });
          await user.save();
        } else {
          const newUser = await UserNotification.create({
            user_id: data,
            notifications: [
              {
                notification_id: notification._id,
                isRead: false,
              },
            ],
          });
          await newUser.save();
        }
      })
    );

    return res.send(notification);
  } catch (e) {
    return res.status(400).send({ message: "error" });
  }
};
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);

    const userNorification = await UserNotification.findOne({
      user_id: id,
    });

    if (!UserNotification) {
      return res.status(200).json({ message: [] });
    }
    return res
      .status(200)
      .json({ message: "success", notification: userNorification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getNotificationByisRead = async (req: Request, res: Response) => {
  try {
    const { id, isRead } = req.query;
    console.log(id);

    const userNorification = await UserNotification.findOne({
      user_id: id,
    }).populate({
      path: "notifications.notification_id",
      select: "message type",
    });

    if (!UserNotification) {
      return res.status(200).json({ message: [] });
    }

    const notification = userNorification.notifications.filter((data: any) => {
      return data.isRead === false;
    });

    return res
      .status(200)
      .json({ message: "success", notification: notification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Find the UserNotification document with the notification_id
    const notification = await Notification.findById(id);
    console.log(notification);
    const userNotification = await Promise.all(
      notification?.srecipient.map(async (user_id: any) => {
        const userNotification = await UserNotification.findOne({ user_id });

        // Check if the UserNotification document exists
        if (!userNotification) {
          return;
        }

        // Find the index of the notification to be deleted
        const notificationIndex = userNotification.notifications.findIndex(
          (n: any) => n.notification_id.equals(id)
        );
        console.log(notificationIndex);

        // Remove the notification from the notifications array
        userNotification.notifications.splice(notificationIndex, 1);

        // Save the updated UserNotification document
        await userNotification.save();
      })
    );

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const trueNotification = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body.data;
  try {
    // Find the UserNotification document with the notification_id
    const userNotification = await Promise.all(
      data?.map(async (id: any) => {
        const userNotification = await UserNotification.findOne({ _id: id });

        // Check if the UserNotification document exists
        if (!userNotification) {
          return;
        }

        // Find the index of the notification to be deleted
        const notificationIndex = userNotification.notifications.map((n: any) =>
          n.notification_id.equals(id)
        );
        console.log(notificationIndex);

        // Remove the notification from the notifications array
        userNotification.notifications(notificationIndex).isRead = true;
        console.log(userNotification);
        // Save the updated UserNotification document
        await userNotification.save();
      })
    );

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const createRooms = async (req:Request, res:Response) => {
//   const { block, rooms, start_with } = req.body;

//   const schema = Joi.object({
//     rooms: Joi.number().required(),
//     block: Joi.string().required(),
//     start_with: Joi.number().required(),
//   });

//   const { error } = schema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }

//   try {
//     const roomData = [];
//     let x = start_with;
//     for (let i = 0; i < rooms; i++) {
//       roomData.push({
//         room_number: x,
//         block: block,
//       });
//       x++;
//     }

//     const createdRooms = await Room.create(roomData);

//     return res.status(200).json({ message: 'Rooms created successfully.', rooms: createdRooms });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'An error occurred while creating rooms.' });
//   }
// };

// export const getAllRooms = async (req: Request, res: Response) => {
//   try {
//     const rooms = await Room.find();
//     return res.status(200).json({ rooms });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// export const getRoomById = async (req: Request, res: Response) => {
//   try {
//     const { roomId } = req.params;

//     const room = await Room.findById(roomId);

//     if (!room) {
//       return res.status(404).json({ message: "Room not found" });
//     }

//     return res.status(200).json({ room });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// export const updateRoom = async (req: Request, res: Response) => {
//   try {
//     const { roomId } = req.params;
//     const { room_number, block } = req.body;

//     // Optional: Validate input data (using a library like Joi or Zod)

//     const updatedRoom = await Room.findByIdAndUpdate(
//       roomId,
//       { room_number, block },
//       { new: true } // Return the updated document
//     );

//     if (!updatedRoom) {
//       return res.status(404).json({ message: "Room not found" });
//     }

//     return res
//       .status(200)
//       .json({ message: "Room updated successfully", room: updatedRoom });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// export const deleteRoom = async (req: Request, res: Response) => {
//   try {
//     const { roomId } = req.params;

//     const deletedRoom = await Room.findByIdAndDelete(roomId);

//     if (!deletedRoom) {
//       return res.status(404).json({ message: "Room not found" });
//     }

//     return res.status(200).json({ message: "Room deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
