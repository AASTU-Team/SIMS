const Student = require("../models/student.model");
const Curriculum = require("../models/curriculum.model");
const Registration = require("../models/registration.model");
const Department = require("../models/department.model");
const Section = require("../models/section.model");

async function assignCourse(Ids: String[]): Promise<any> {
  const courses: any[] = [];
  const success: any = [];

  const freshmancurriculum = await Curriculum.findOne({ name: "freshman" });

  if (!freshmancurriculum) {
    return [];
  }

  const freshmanCourses: any[] = freshmancurriculum.courses;

  freshmanCourses.map((course) => {
    if (course.semester === 1) {
      courses.push({
        courseID: course.courseId,
        grade: "",
        status: "Active",
        isRetake: false,
      });
    }
  });

  Ids.map((studentId) => {
    const registration = new Registration({
      stud_id: studentId,
      year: 1,
      semester: 1,
      courses: courses,
      registration_date: new Date(),
      // section_id:"",
    });

    registration.save();

    if (registration) {
      success.push(studentId);
    }
  });
  await assignSection({
    department: "freshman",
    year: 1,
    semester: 1,
  });

  return success;
}
interface AssignSection {
  department: string;
  year: Number;
  semester: Number;
}
async function assignSection({
  department,
  year,
  semester,
}: AssignSection): Promise<void> {
  try {
    // Get students based on department, year, and semester
    const dept = await Department.findOne({ name: department });

    if (!dept) {
      throw new Error("Department not found");
    }
    const students = await Student.find({ department_id: dept._id, year });

    // Calculate the number of sections (rounded up)
    const numSections = Math.ceil(students.length / 30);

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
      } else {
        // Create new section
        await Section.create({ name: sectionName, department, year, semester });
        const section = await Section.findOne({
          name: sectionName,
          department,
          year,
          semester,
        }); // Get the newly created section
        await Registration.findOneAndUpdate(
          { _id: student._id },
          { section_id: section._id }
        );
      }

      await student.save();

      count++;
      if (count % 30 === 0) {
        sectionId = String.fromCharCode(sectionId.charCodeAt(0) + 1); // Increment section letter
        count = 0; // Reset count for the next section
      }
    }

    console.log(
      "Section IDs assigned successfully for department:",
      department
    );
  } catch (err) {
    console.error("Error assigning section IDs:", err);
  }
}

module.exports = assignCourse;
