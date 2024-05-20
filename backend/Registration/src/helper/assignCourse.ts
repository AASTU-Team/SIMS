const Student = require("../models/student.model");
const Curriculum = require("../models/curriculum.model");
const Registration = require("../models/registration.model");
const Department = require("../models/department.model");
const Section = require("../models/section.model");
const Course = require("../models/course.model");

async function getCredit(Id: String): Promise<any> {
  const course = await Course.findById(Id);
  if (!course) {
    //console.error("Course not found");
    return 0;
  }
  // console.log(parseInt(course.credits));

  return parseInt(course.credits);
}

async function assignCourse(Students: any): Promise<any> {
  //console.log("hre")
  const courses: any[] = [];
  const success: any = [];

  /////////////////////////////////////////////////////////////////////////////////////////////////

  for (const student of Students) {
    const Departmentcurriculum = await Curriculum.findOne({ name: student.department,year:1,semester:1,type:student.type });
    console.log(Departmentcurriculum)
    if (!Departmentcurriculum) {
      return [];
    }
    const DepartmentCourses: any[] = Departmentcurriculum.courses;
    const total_credit: Number[] = [];

    await Promise.all(
        DepartmentCourses.map(async (course) => {
         // if (course.semester === 1) {
            courses.push({
              courseID: course,
              grade: "",
              status: "Active",
              isRetake: false,
            });
            const value = await getCredit(course);
            total_credit.push(value);
         // }
        })
      );

   
        let sum: number = 0;
        total_credit.map((credit: any) => {
          sum += credit;
        });
        const registration = new Registration({
          stud_id: student.id,
          year: 1,
          semester: 1,
          courses: courses,
          registration_date: new Date(),
          total_credit: sum,
          section_id: null,
          status:"Confirmed",
        });
    
        registration.save();
    
        if (registration) {
          success.push(student.id);
        }
      


  }

  /////////////////////////////////////////////////////////////////



 




/*   await assignSection({
    department: "Freshman",
    year: 1,
    semester: 1,
  }); */

  return success;
}


module.exports = assignCourse;
