const Student = require("../models/student.model");
const Curriculum = require("../models/curriculum.model");
const Registration = require("../models/registration.model");
const Course = require("../models/course.model");

async function checkPrerequisite(course: String, student: String) {
  const courseData = await Course.findById(course);
  const registration = await Registration.find({ stud_id: student });

  if (!courseData) {
    return false;
  }

  if (courseData.prerequisites.length === 0) {
    return true;
  }

  const prerequisites: any[] = courseData.prerequisites;
  const completedCourses = registration.filter((reg:any) => reg.status === "Completed").map((reg:any) => reg.courseID);

  for (const prereq of prerequisites) {
    if (!completedCourses.includes(prereq)) {
      return false;
    }
  }

  return true;
}

module.exports = checkPrerequisite;
