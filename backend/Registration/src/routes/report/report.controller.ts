import { patch } from "app";
import { Request, Response } from "express";
import mongoose from "mongoose";
const fs = require("fs");
const csv = require("csv-parser");
const Joi = require("joi");

let results: any = [];
const calculateGradePoints = (grade: string): number => {
  switch (grade) {
    case 'A':
    case 'A+':
      return 4.0;
    case 'A-':
      return 3.75;
    case 'B+':
      return 3.5;
    case 'B':
      return 3.0;
    case 'B-':
      return 2.75;
    case 'C+':
      return 2.5;
    case 'C':
      return 2.0;
    case 'D':
      return 1.0;
    case 'F':
      return 0.0;
    default:
      return 0.0;
  }
};

const Course = require("../../models/course.model")
const Registration = require("../../models/registration.model")


export const getAvgCourseGrade = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send('The course with the given ID was not found.');
    }

    const registrations = await Registration.find({
      'courses.courseID': courseId,
    })

    let totalGradePoints = 0;
    let totalCreditHours = 0;

    //console.log("registrations",registrations);

    for (const registration of registrations) {
      for (const courseInRegistration of registration.courses) {
       // console.log("courseInRegistration",courseInRegistration.courseID);
        if(courseInRegistration._id == courseId) {
          
          console.log("courseInRegistration",courseInRegistration.grade);
        if ( courseInRegistration.grade &&courseInRegistration.status !== 'Incomplete'  )
      
          {
          const gradePoints =
            calculateGradePoints(courseInRegistration.grade) *
            parseFloat(courseInRegistration.courseID.credits);
          totalGradePoints += gradePoints;
          totalCreditHours += parseFloat(course.credits);
        }
      }
      }
    }

    const averageGrade = totalCreditHours > 0 ? totalGradePoints / totalCreditHours : 0;
    return res.json({ averageGrade });
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred while fetching the average course grade.');
  }
};