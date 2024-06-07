import { patch } from "app";
import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

let results: any = [];

const Section = require("../../models/section.model");
const Course = require("../../models/course.model");
const {
  assignSectionSchedule,
} = require("../assignment/assignment.controller");

export const getSections = async (req: Request, res: Response) => {
  // fetch dep id from the auth

  try {
    // use find({dep_id : id from fetch })
    const status: any = await Section.find();

    res.status(200).json({ data: status });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
// export const getStatusById = async (req: Request, res: Response) => {
//   // fetch dep id from the auth
//   const { id } = req.params;
//   try {
//     // use find({dep_id : id from fetch })
//     const status: any = await AddStatus.findById({ _id: id });
//     res.status(200).json({ data: status });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const createSection = async (req: Request, res: Response) => {
  const data = req.body.data;
  const courseData = req.body.courseData;
  try {
    const sec = await Section.find(data);
    if (sec.length) {
      return res.send("section exists");
    }
    const newSection = await new Section(data);

    // create assignmnet for section
    const course = await Course.findById(courseData.course_id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.lab) {
      await assignSectionSchedule({
        course_id: courseData.course_id,
        section_id: newSection._id,
        Lab_Lec: "Lab",
        year: data.year,
        semester: data.semester,
      });
    }
    await assignSectionSchedule({
      course_id: courseData.course_id,
      section_id: newSection._id,
      Lab_Lec: "Lec",
      year: data.year,
      semester: data.semester,
    });
    await newSection.save();
    return res.status(201).json({ message: "success", section: newSection });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
// export const updateStatus = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const requestData = req.body;
//     const updates = await AddStatus.findByIdAndUpdate(id, requestData, {
//       new: true,
//     }).exec();
//     if (!updates) {
//       return res.status(500).json({ message: "An error happened" });
//     } else {
//       console.log("Document updated successfully!");
//       return res.status(200).json({ message: updates });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "An error occurred" });
//   }
// };
// export const deleteStatus = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     const deletedStatus = await AddStatus.findByIdAndDelete(id);
//     if (!deletedStatus) {
//       return res.status(404).json({ message: "Not found" });
//     }
//     return res.status(200).json({ message: "success" });
//   } catch (error: any) {
//     console.log(error.message);
//     return res.status(500).json({ message: error.message });
//   }
// };
// async function getCourses(
//   department: String,
//   year: Number,
//   semester: Number,
//   type: string
// ) {
//   console.log(department, year, semester, type);
//   const curriculums: any = await Curriculum.findOne({
//     department_id: department,
//     year,
//     semester,
//     type,
//   }).populate("courses");
//   const addition: any[] = [];
//   const courses: any[] = curriculums.courses.map((data: any) => {
//     console.log(data);
//     console.log(data._id);
//     if (data.lab) {
//       addition.push({ courses_id: data._id.toString(), Lab_Lec: "Lec" });
//       addition.push({ courses_id: data._id.toString(), Lab_Lec: "Lab" });
//     } else {
//       addition.push(
//         addition.push({ courses_id: data._id.toString(), Lab_Lec: "Lec" })
//       );
//     }
//   });

//   return addition;
//   // console.log(curriculums[0].courses);
// }
