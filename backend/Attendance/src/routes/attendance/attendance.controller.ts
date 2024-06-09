import { Request, Response } from "express";
import mongoose from "mongoose";
const Course = require("../../models/course.model");
//const ATtendance = require('../../models/Attendance.model');
import Attendacne from "../../models/Attendance.model";

interface Attendance2 {
  student_id: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}
interface edit {
  attendance_id: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}

export const registerAttendance = async (req: Request, res: Response) => {
  const data = req.body;

  const course_id = data.course_id;
  const instructor_id = data.instructor_id;
  const date = data.date;
  // const attendance: Attendance2[] = data.attendance;

  const course = await Course.findById(course_id);

  if (!course) {
    return res.status(400).json({ message: "Course not found" });
  }

  for (const attend of data.attendance) {
    if (
      attend.status !== "Present" &&
      attend.status !== "Absent" &&
      attend.status !== "Late" &&
      attend.status !== "Excused"
    ) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }
    const current_attendance = await Attendacne.findOne({
      course_id: course_id,
      student_id: attend.student_id,
      instructor_id: instructor_id,
    });
    console.log(current_attendance);
    if (current_attendance) {
      const updatedAttendance = await Attendacne.findOneAndUpdate(
        {
          course_id,
          instructor_id: instructor_id,
          student_id: attend.student_id,
        },
        {
          $push: {
            attendances: {
              date: date,
              status: attend.status,
            },
          },
        },
        { new: true }
      );
    } else {
      const newAttendance = new Attendacne({
        course_id: course_id,
        instructor_id: instructor_id,
        student_id: attend.student_id,
        attendances: [
          {
            date: date,
            status: attend.status,
          },
        ],
      });
      console.log(newAttendance);
      await newAttendance.save();
    }
  }
  // data.attendance.forEach(async (attend: any) => {
  //   if (
  //     attend.status !== "Present" &&
  //     attend.status !== "Absent" &&
  //     attend.status !== "Late" &&
  //     attend.status !== "Excused"
  //   ) {
  //     return res.status(400).json({ message: "Invalid attendance status" });
  //   }
  //   const current_attendance = await Attendacne.find({
  //     course_id: course_id,
  //     student_id: attend.student_id,
  //   });
  //   if (current_attendance) {
  //     const updatedAttendance = await Attendacne.findOneAndUpdate(
  //       {
  //         course_id,
  //         instructor_id: instructor_id,
  //         student_id: attend.student_id,
  //       },
  //       {
  //         $push: {
  //           attendances: {
  //             date: date,
  //             status: attend.status,
  //           },
  //         },
  //       },
  //       { new: true }
  //     );
  //   } else {
  //     const newAttendance = new Attendacne({
  //       course_id: course_id,
  //       instructor_id: instructor_id,
  //       student_id: attend.student_id,
  //       attendances: [
  //         {
  //           date: date,
  //           status: attend.status,
  //         },
  //       ],
  //     });
  //     await newAttendance.save();
  //   }
  // });

  return res
    .status(200)
    .json({ message: "Attendance registered successfully" });

  // const current_attendance = await Attendacne.find({
  //   course_id: course_id,
  //   student_id: student_id,
  // });

  // const newArray = [];
  // let updatesMade = false;

  // Asynchronous loop using for...of
  // for (const item of attendance) {
  //   let student_id = item.student_id;
  //   let status = item.status;

  //   const currentAttendance = await Attendacne.findOne({
  //     course_id: course_id,
  //     student_id: item.student_id,
  //   });

  //   if (currentAttendance) {
  //     const updatedAttendance = await Attendacne.findOneAndUpdate(
  //       { course_id, student_id },
  //       {
  //         $push: {
  //           attendances: {
  //             date: date,
  //             status: status,
  //           },
  //         },
  //       },
  //       { new: true }
  //     );

  //     console.log("Updated attendance:", updatedAttendance);
  //     updatesMade = true;
  //     //return res.status(200).json({ message: "Attendance registered successfully" });
  //   } else {
  //     newArray.push({
  //       course_id: course_id,
  //       instructor_id: instructor_id,
  //       student_id: item.student_id,
  //       attendances: [
  //         {
  //           date: date,
  //           status: item.status,
  //         },
  //       ],
  //     });
  //   }
  // }

  // if (updatesMade) {
  //   console.log("Attendance updated successfully");
  //   return res.status(200).json({ message: "Attendance updated successfully" });
  // } else {
  //   Attendacne.insertMany(newArray)
  //     .then((result) => {
  //       console.log("Inserted", result.length, "attendance records");
  //       return res
  //         .status(200)
  //         .json({ message: "Attendance registered successfully" });
  //     })

  // catch((error) => {
  //   console.error("Error inserting attendance records:", error);
  //   return res
  //     .status(500)
  //     .json({ message: "Error inserting attendance records" });
  // });
  // }
};
export const getInstructorAttendance = async (req: Request, res: Response) => {
  const data = req.body;

  const course_id = data.course_id;
  const instructor_id = data.instructor_id;

  const attendance = await Attendacne.find({
    course_id: course_id,
    instructor_id: instructor_id,
  });

  console.log(attendance);
  const attendanceData: any = [];
  for (let attend of attendance) {
    let count = 0;
    for (const att of attend.attendances) {
      if (att.status == "Absent") {
        count = count + 1;
      }
    }
    const Present =
      ((attend.attendances.length - count) / attend.attendances.length) * 100;
    //send notification
    attendanceData.push({
      ...attend.toObject(),
      Present,
    });
  }

  if (!attendance) {
    return res.status(400).json({ message: "Attendance not found" });
  }

  res.status(200).json(attendanceData);
};

export const getAttendance = async (req: Request, res: Response) => {
  const data = req.body;

  const course_id = data.course_id;
  // c
  const student_id = data.student_id;

  const attendance = await Attendacne.find({
    course_id: course_id,
    student_id: student_id,
  });

  if (!attendance) {
    return res.status(400).json({ message: "Attendance not found" });
  }

  return res.status(200).json(attendance);
};

export const editAttendance = async (req: Request, res: Response) => {
  console.log(req.body.attendance[0].attendances);
  const data = req.body.attendance;
  try {
    const edits = data.map(async ({ attendance_id, attendances }: any) => {
      const student = await Attendacne.findById(attendance_id);
      if (!student) {
        throw new Error(`Student with ID ${attendance_id} not found`);
      }
      attendances.forEach(({ date, status, _id }: any) => {
        const attendanceIndex = student.attendances.findIndex((att: any) => {
          const newdate = new Date(date);
          console.log(att.date.getTime(), new Date(date), _id, att._id);
          return (
            att.date.getTime() === new Date(date).getTime() &&
            att._id.toString() === _id
          );
        });
        console.log(attendanceIndex);
        if (attendanceIndex !== -1) {
          student.attendances[attendanceIndex].status = status;
        } else {
          // If day not found, create a new attendance record
          student.attendances.push({ date, status });
        }
      });

      return await student.save();
    });

    const edit = await Promise.all(edits);

    return res.status(200).send({
      message: "Attendance records updated successfully!",
      update: edit,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).send({
      message: "Error",
      error: error.message,
    });
  }
};

export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const { course_id, instructor_id, date } = req.body;

    // Find the attendance document that matches the provided course_id, instructor_id
    const attendance = await Attendacne.updateMany(
      {
        course_id,
        instructor_id,
      },
      {
        $pull: {
          attendances: {
            date: new Date(date),
          },
        },
      },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json({ message: "Attendance deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
