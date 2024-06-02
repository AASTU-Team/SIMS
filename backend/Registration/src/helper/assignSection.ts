const Student = require("../models/student.model");
const Registration = require("../models/registration.model");
const Department = require("../models/department.model");
const Section = require("../models/section.model");
const NumberOfStudent = require("../models/numberOfStudent.model");
const incStudentNumber = require("./incStudentNumber");

interface AssignSection {
  department: string;
  year: Number;
  semester: Number;
  max: number;
}
async function assignSection({
  department,
  year,
  semester,
  max,
}: AssignSection): Promise<{ success: boolean; message: any }> {
  try {
    // Get students based on department, year, and semester
    const dept = await Department.findOne({ name: department });
    console.log(dept);
    if (!dept) {
      throw new Error("Department not found");
    }
    const students = await Student.find({ department_id: dept._id, year });
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
        department,
        year,
        semester,
      });

      if (existingSection) {
        // Section exists, assign it to the student
        const a = await Registration.findOneAndUpdate(
          { stud_id: student._id, semester },
          { section_id: existingSection._id }
        );
        a?.courses.forEach(async (courseData: any) => {
          const course = courseData.courseID;
          // add student to number of students
          await incStudentNumber(existingSection._id, course, student._id);
        });
      } else {
        // Create new section
        await Section.create({ name: sectionName, department, year, semester });
        const section = await Section.findOne({
          name: sectionName,
          department,
          year,
          semester,
        }); // Get the newly created section
        const a = await Registration.findOneAndUpdate(
          { stud_id: student._id, semester },
          { section_id: section._id }
        );
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

module.exports = assignSection;
