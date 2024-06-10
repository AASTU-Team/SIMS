import { Request,Response } from "express";
const Student = require("../models/student.model");
const Semester = require("../models/Semesters.model")
const AddStatus = require("../models/AddStatus.model")


const checkAddStatus = async(req:Request, res:Response, next:any) => {

 
    const student_id = req.body.student_id
 
    

  
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
            program:student.type
           
          });

          if (!semesterDoc) {
            return res.status(404).json({
              message: "Semester not found"
            });
          }

          const status = await AddStatus.findOne({semester: semesterDoc._id})


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

module.exports = checkAddStatus
