const Student = require("../models/student.model");
const Registration = require("../models/registration.model");
const Department = require("../models/department.model");
const Section = require("../models/section.model");
const Curriculum = require("../models/curriculum.model");
const NumberOfStudent = require("../models/numberOfStudent.model");
const incStudentNumber = require("./incStudentNumber");
const {
  assignSectionSchedule,
} = require("../routes/assignment/assignment.controller");

interface AssignSection {
  department: string;
  year: Number;
  semester: Number;
  max: number;
  type: string;
}
async function assignSection({
  department,
  year,
  semester,
  max,
  type,
}: AssignSection): Promise<{ success: boolean; message: any }> {
  try {
    // Get students based on department, year, and semester
    const dept = await Department.findById(department);
    console.log(dept);
    if (!dept) {
      throw new Error("Department not found");
    }
    const students = await Student.find({
      department_id: dept._id,
      year,
    });
    console.log(students);
    // Calculate the number of sections (rounded up)
    const numSections = Math.ceil(students.length / max);
    const studentPerSec = Math.ceil(students.length / numSections);
    console.log(numSections, studentPerSec);

    // Loop through students and assign section IDs
    let sectionId = "A";
    let count = 0;
    for (const student of students) {
      // Construct section name based on parameters
      const sectionName = `${sectionId}`;

      // Check if section exists
      const existingSection = await Section.findOne({
        name: sectionName,
        department: department,
        year,
        semester,
        type,
      });

      if (existingSection) {
        // Section exists, assign it to the student
        const a = await Registration.findOneAndUpdate(
          { stud_id: student._id, semester, year },
          { section_id: existingSection._id }
        );
        a?.courses.forEach(async (courseData: any) => {
          const course = courseData.courseID;
          // add student to number of students
          await incStudentNumber(existingSection._id, course, student._id);
        });
      } else {
        // Create new section
        await Section.create({
          name: sectionName,
          department: department,
          year,
          semester,
          type,
        });
        const section = await Section.findOne({
          name: sectionName,
          department: department,
          year,
          semester,
          type,
        }); // Get the newly created section
        console.log(section);
        const a = await Registration.findOneAndUpdate(
          { stud_id: student._id, semester, year },
          { section_id: section._id }
        );
        console.log(a);
        a?.courses.forEach(async (courseData: any) => {
          const course = courseData.courseID;
          // add student to number of students
          await incStudentNumber(section._id, course, student._id);
        });
      }

      await student.save();

      count++;
      if (count % studentPerSec === 0) {
        sectionId = String.fromCharCode(sectionId.charCodeAt(0) + 1); // Increment section letter
        count = 0; // Reset count for the next section
      }
    }
    const sections = await Section.find({
      department: department,
      year,
      semester,
      type,
    });
    console.log(" sections ", sections);

    const courses = await getCourses(department, year, semester, type);
    console.log(courses);
    courses.forEach((course: any) => {
      sections.forEach(async (sec: any) => {
        await assignSectionSchedule({
          course_id: course.courses_id,
          section_id: sec._id,
          Lab_Lec: course.Lab_Lec,
          year,
          semester,
        });
      });
    });

    return {
      success: true,
      message: ` "Section IDs assigned successfully for department:",
    ${department}`,
    };
  } catch (err: any) {
    return { success: false, message: err.message };
    console.error("Error assigning section IDs:", err);
  }
}
// async function incStudentNumber(id: string, course: string, stud_id: string) {
//   const number = await NumberOfStudent.findOne({
//     section_id: id,
//     course_id: course,
//   });
//   console.log(number);
//   if (number) {
//     number.numberOfStudent.push(stud_id);
//     await number.save();
//     return;
//   } else {
//     const numstud = await NumberOfStudent.create({
//       course_id: course,
//       section_id: id,
//       numberOfStudent: [stud_id],
//     });
//     await numstud.save();
//   }
// }
async function getCourses(
  department: String,
  year: Number,
  semester: Number,
  type: string
) {
  console.log(department, year, semester, type);
  const curriculums: any = await Curriculum.findOne({
    department_id: department,
    year,
    semester,
    type,
  }).populate("courses");
  const addition: any[] = [];
  const courses: any[] = curriculums.courses.map((data: any) => {
    console.log(data);
    console.log(data._id);
    if (data.lab) {
      addition.push({ courses_id: data._id.toString(), Lab_Lec: "Lec" });
      addition.push({ courses_id: data._id.toString(), Lab_Lec: "Lab" });
    } else {
      addition.push(
        addition.push({ courses_id: data._id.toString(), Lab_Lec: "Lec" })
      );
    }
  });

  return addition;
  // console.log(curriculums[0].courses);
}

module.exports = assignSection;
