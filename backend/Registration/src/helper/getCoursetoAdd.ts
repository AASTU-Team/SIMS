const Student = require("../models/student.model");
const Curriculum = require("../models/curriculum.model");
const Registration = require("../models/registration.model");
const checkPrerequisite = require("./checkPrerequisite");
const Course = require("../models/course.model");

async function getCourseToAdd(StudentID: String): Promise<any> {
  const student_id = StudentID;

  let department_id = "";

  const takencourses: String[] = [];
  const PossibleCourse: any[] = [];
  const coursesData: any[] = [];
  const Departmentcourses: any[] = [];

  const student = await Student.findById(student_id);

  if (!student) {
    return [];
  }

  department_id = student.department_id;

  const highestCombination = await Registration.findOne({ stud_id: student_id })
    .sort({ year: -1, semester: -1 })
    .select("year semester")
    .limit(1);

  if (highestCombination) {
    const highestYear = highestCombination.year;
    const highestSemester = highestCombination.semester;

    const courses = await Registration.find({ stud_id: student_id }).select(
      "courses"
    );
    courses.forEach((course: any) => {
      coursesData.push(...course.courses);
    });
    coursesData.forEach((course: any) => {
      console.log("str", course.grade, "end");
      if (!(course.grade == "NG") || !(course.grade == "F")) {
        takencourses.push(course?.courseID.toString());
      }
    });

    const curriculum = await Curriculum.find({
      department_id: department_id,
      semester: highestSemester,
    });

    if (!curriculum) {
      return [];
    }
    curriculum.forEach((curr: any) => {
      Departmentcourses.push(...curr.courses);
    });
    for (const course of Departmentcourses) {
      const status = await checkPrerequisite(course.toString(), student_id);
      if (!takencourses.includes(course.toString()) && status) {
        PossibleCourse.push(course);
      }
    }
    const coursesMain = await Course.find({ _id: { $in: PossibleCourse } });
    return coursesMain;
  }
}

module.exports = getCourseToAdd;
