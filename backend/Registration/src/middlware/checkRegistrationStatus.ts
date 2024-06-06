import { Request,Response } from "express";
const Student = require("../models/student.model");
const Semester = require("../models/Semesters.model")
const RegistrationStatus = require("../models/RegistrationStatus.model")


const checkRegistrationStatus = async(req:Request, res:Response, next:any) => {

  let student_id = ""


  if (req.body.student_id) {
     student_id = req.body.student_id;
 
  } else {
 
    if (req.params.student_id) {
      student_id = req.params.student_id;
 
      // Neither request body nor request parameters have the student_id
      return res.status(400).json({ message: "Student ID is required" });
    }
  }

  
    const student = await Student.findById(student_id)

    if(!student)
        {
            return res.status(404).json({
                message: "Student not found"
            })
        }

        const y  = student.year
        const year = y.toString()
        const s = student.semester
        const semester = s.toString()

        console.log(year, semester)


        const semesterDoc = await Semester.findOne({
            semester: semester,
            batches: { $regex: `\\b${year}\\b` },
           
          });

          if (!semesterDoc) {
            return res.status(404).json({
              message: "Semester not found"
            });
          }

          const status = await RegistrationStatus.findOne({semester: semesterDoc._id})


          if(!status)
          {
            return res.status(404).json({
              message: " Status not Found"
            });
          }

          if(status.status == "Inactive")
            {
                return res.status(200).json({
                  message: "Inactive"
                });
            }

            next()











}

module.exports = checkRegistrationStatus
