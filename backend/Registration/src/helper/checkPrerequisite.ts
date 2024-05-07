const Student = require("../models/student.model");
const Curriculum = require("../models/curriculum.model");
const Registration = require("../models/registration.model");
const Course = require("../models/course.model");

async function checkPrerequisite(
  course: String,
  student: String
): Promise<any> {
  const courseData = await Course.findById(course);
  const coursesData: any[] = [];
  const statuses: Boolean[] = [];

  if (!courseData) {
    return false;
  }

  if (courseData.prerequisites.length === 0) {
    return true;
  }

  const prerequisites: any[] = courseData.prerequisites;

  for (const prereq of prerequisites) {
    const registration = await Registration.find({ stud_id: student });
    // Code to be executed for each prerequisite and registration
  }

  const registration = await Registration.find({ stud_id: student });

  for (const reg of registration) {
    coursesData.push(reg.courses);
  }
  for (const courses of coursesData) {
    // Check each course in the current array
    for (const course of courses) {
      // Check if the courseID is in the prerequisites array
      if (prerequisites.includes(course.courseID)) {
        // Check if the status is "Completed"
        if (course.status === "Completed") {
          console.log(`${course.courseID} is a prerequisite and is completed`);
          statuses.push(true);
        } else {
          console.log(
            `${course.courseID} is a prerequisite but is not completed`
          );
          statuses.push(false);
        }
      }
    }
  }

  const hasFalse = statuses.some((status) => status === false);

  if (hasFalse) {
    return false;
  } else {
    return true;
  }

  //return coursesData
}

module.exports = checkPrerequisite;
