const Student = require("../models/student.model");
const Curriculum = require("../models/curriculum.model");
const Registration = require("../models/registration.model");
const Course = require("../models/course.model");

async function isCourseTaken(courseID: String, student: String): Promise<any> {
  const courseData = await Course.findById(courseID);
  const coursesData: any[] = [];
  const statuses: Boolean[] = [];
  let status: Boolean = false;

  if (!courseData) {
    return false;
  }

  const registration = await Registration.find({ stud_id: student });

  for (const reg of registration) {
    coursesData.push(reg.courses);
  }
  // console.log(coursesData)

  for (const courses of coursesData) {
    // Check each course in the current array
    for (const course of courses) {
      // Check if the courseID is in the prerequisites array
      if (course.courseID == courseID) {
        console.log(`found it ${course.courseID}`);
        // Check if the status is "Completed"
        if (course.status === "Completed" || course.grade) {
          console.log(`${course.courseID}`);
          //statuses.push(true)
          //return true
          status = true;
          break;
        } else {
          console.log(`${course.courseID}`);
          statuses.push(false);
          //  return false
        }
      }
    }
  }

  if (status) {
    return true;
  } else {
    return false;
  }

  /*    const hasFalse = statuses.some(status => status === false);

if (hasFalse) {
  return false
} else {
 return true
} */

  //return coursesData
}

module.exports = isCourseTaken;
