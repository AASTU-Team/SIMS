const Student = require("../models/student.model");
const Curriculum = require("../models/curriculum.model");
const Registration = require("../models/registration.model");
const Course = require("../models/course.model");
async function checkPrerequisite(course: string, student: string) {
  const courseData = await Course.findById(course).populate("prerequisites");
  const studentRegistrations = await Registration.find({ stud_id: student, status: "Completed" }).populate("courseID");

  if (!courseData) {
    return false;
  }

  if (courseData.prerequisites.length === 0) {
    return true;
  }

  const completedCourseIds = studentRegistrations.map((reg:any) => reg.courseID._id.toString());

  for (const prereq of courseData.prerequisites) {
    if (!completedCourseIds.includes(prereq._id.toString())) {
      // Check if the prerequisite course is available in the student's curriculum
      const curriculum = await Curriculum.findOne({ student_id: student, course_id: prereq._id });
      if (!curriculum) {
        return false; // Return false if the prerequisite course is not found in the student's registration or curriculum
      }
    }
  }

  return true;
}

module.exports = checkPrerequisite;

