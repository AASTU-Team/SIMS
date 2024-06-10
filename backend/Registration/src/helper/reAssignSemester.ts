const Student = require("../models/student.model");

const Semester = require("../models/Semesters.model");

const Registration = require("../models/registration.model");
const Assignment = require("../models/Assignment.model");

import axios from "axios";
async function calculateCGPA(studentId: any) {
  try {
    const allRegistrations = await Registration.find({
      student: studentId,
    }).populate("courses.courseID");

    let totalGradePoints = 0;
    let totalCreditHours = 0;

    for (const registration of allRegistrations) {
      for (const course of registration.courses) {
        // Check if the course has a valid grade
        if (course.grade && course.grade !== "Incomplete") {
          // Calculate the grade points for the course
          let gradePoints;
          switch (course.grade) {
            case "A":
              gradePoints = 4.0;
              break;
            case "B":
              gradePoints = 3.0;
              break;
            case "C":
              gradePoints = 2.0;
              break;
            case "D":
              gradePoints = 1.0;
              break;
            case "F":
              gradePoints = 0.0;
              break;
            default:
              gradePoints = 0.0;
          }

          // console.log("course",course)

          // Add the grade points to the total
          totalGradePoints += gradePoints * parseInt(course.courseID.credits);
          totalCreditHours += parseInt(course.courseID.credits);
        }
      }
    }

    // Calculate the CGPA
    const cgpa = totalGradePoints / totalCreditHours;
    await Student.findByIdAndUpdate(studentId, { CGPA: cgpa });
    return cgpa;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function reAssignSemester(id: any): Promise<any> {
  const semester: any = await Semester.findById(id);
  const errors: any = [];
  const success: any = [];

  if (!semester) {
    success.push("unable to find semester");
  }
  const batchesAsStrings: string[] = semester.batches;
  const batchesAsIntegers: number[] = batchesAsStrings.map((batch) =>
    parseInt(batch)
  );
  const semestersAsIneger = parseInt(semester.semester);

  const students = await Student.find({
    semester: semestersAsIneger,
    year: { $in: batchesAsIntegers },
  });
  //console.log(students)
  if (students.length > 0) {
    for (const student of students) {
      // const CGPA = await calculateCGPA(student._id)
      //  console.log(CGPA)
      let isPass = "PASS";

      const regData = await Registration.findOne({
        stud_id: student._id,
        year: student.year,
        semester: student.semester,
      });
      if (regData) {
        //   console.log(regData.status)
        if (regData.status != "Registrar") {
          continue;
        }
        /*    if(student.CGPA)
                {
                  if(student.CGPA < 1.75)
                    {
                      continue
                    }

                } */

        // console.log("here")
        const courses = regData.courses;
        const modifiedCourses = courses.map((course: any) => ({
          courseId: course.courseID,
        }));
        // console.log(modifiedCourses)

        try {
          const response = await axios.post(
            "http://localhost:9000/calculateGPAs",
            {
              students: [
                {
                  studentId: regData.stud_id,
                  courses: modifiedCourses,
                },
              ],
            }
          );

          // Handle the response
          //  console.log(response.data);
          const data = response.data;

          // console.log("insidle loop",data[0].courseGrades)

          const getCourses = data[0].courseGrades;

          const newArray = getCourses.map((obj: any) => {
            let status = "Active";
            if (obj.grade == "NG") {
              status = "Incomplete";
              isPass = "Fail";
            } else if (!obj.grade) {
              status = "Incomplete";
              isPass = "Fail";
            } else {
              status = "Complete";
            }

            return {
              courseID: obj.courseId,
              grade: obj.grade || "",
              status: status,
              isRetake: regData.isRetake,
              section: regData.section || null,
            };
          });

          const newReg = await Registration.findByIdAndUpdate(regData._id, {
            GPA: data[0].semesterGPA,
            courses: newArray,
          });
          if (newReg) {
            ///////////////////////////////////////////////////////////////////////////////
            //  console.log("here")
            try {
              const allRegistrations = await Registration.find({
                stud_id: student._id,
              }).populate("courses.courseID");

              let totalGradePoints = 0;
              let totalCreditHours = 0;

              for (const registration of allRegistrations) {
                for (const course of registration.courses) {
                  // Check if the course has a valid grade
                  if (course.grade && course.status !== "Incomplete") {
                    console.log(course);

                    // Calculate the grade points for the course
                    let gradePoints;
                    switch (course.grade) {
                      case "A":
                        gradePoints = 4.0;
                        break;
                      case "A+":
                        gradePoints = 4.0;
                        break;
                      case "A-":
                        gradePoints = 3.75;
                        break;
                      case "B+":
                        gradePoints = 3.5;
                        break;
                      case "B":
                        gradePoints = 3.0;
                        break;
                      case "B-":
                        gradePoints = 2.75;
                        break;
                      case "C+":
                        gradePoints = 2.5;
                        break;
                      case "C":
                        gradePoints = 2.0;
                        break;
                      case "D":
                        gradePoints = 1.0;
                        break;
                      case "F":
                        gradePoints = 0.0;
                        break;
                      default:
                        gradePoints = 0.0;
                    }

                    //  console.log("course",course)

                    // Add the grade points to the total
                    totalGradePoints +=
                      gradePoints * parseFloat(course.courseID.credits);
                    totalCreditHours += parseFloat(course.courseID.credits);
                  }
                }
              }

              // Calculate the CGPA
              const cgpa = totalGradePoints / totalCreditHours;
              await Student.findByIdAndUpdate(student._id, { CGPA: cgpa });
              if (cgpa < 1.75) {
                continue;
              }
              //  return cgpa;
              console.log("cgpa", cgpa);
            } catch (err) {
              console.error(err);
              throw err;
            }

            ////////////////////////////////////////////////////////////////////
          } else {
            console.log("error");
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      } else {
        continue;
      }
      if (isPass == "Fail") {
        //continue
      }
      let year = 0;
      let semester = 0;
      if (student.semester == 1) {
        semester = parseInt(student.semester) + 1;
        year = parseInt(student.year);
      } else if (student.semester == 2) {
        semester = 1;
        year = parseInt(student.year) + 1;
      }

      student.year = year;
      student.semester = semester;
      student.save();
    }
  }
}

module.exports = reAssignSemester;
