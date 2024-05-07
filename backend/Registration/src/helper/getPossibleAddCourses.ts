const Student = require("../models/student.model");
const Curriculum = require("../models/curriculum.model");
const Registration = require("../models/registration.model");
const Course = require("../models/course.model");
const checkPrerequisite = require('./checkPrerequisite')


async function getPossibleAddCourses(StudentID:String): Promise<any> {
    const student_id = StudentID;

    let department_id = ""
    let newyear = 0
    let newsemester = 0
  
    const courses:String[]  = []
    const PossibleCourse:any[]=[]
    const coursesData:any[]=[]
    const Departmentcourses:any[]=[]
  
  
    const student = await Student.findById(student_id);
  
    if(!student) {
      return []
  
    }
    department_id = student.department_id
  
  
  
  
  
  
    const highestCombination = await Registration
    .findOne({ stud_id: student_id })
    .sort({ year: -1, semester: -1 })
    .select('year semester')
    .limit(1);
  
  if (highestCombination) {
    const highestYear = highestCombination.year;
    const highestSemester = highestCombination.semester;


    if(highestYear ==1)
        {
            return []
        }

        const years = [1,2,3,4,5]

        for(let i = 0; i < years.length; i++)
            {
                if(years[i] == highestYear)
                    {
                        years.splice(i, 1);
                        i--;

                    }

            }

           // return years;

           const freshmancurriculum = await Curriculum.find({ name: "Freshman" });

           if (!freshmancurriculum) {
             //return [];
           }
         
           for (const curr of freshmancurriculum) {

            coursesData.push(curr.courses)
    
        }
         
       
            for (const array of coursesData) {
                for (const course of array) {
                if (course.semester === highestSemester) {
                    courses.push(course.courseId);
                }
                }
            }




            for (const year of years) {
                console.log(department_id);
                console.log(year);
              
                const curriculum = await Curriculum.findOne({ department_id: department_id, year: year });
              
                if (!curriculum || !curriculum.courses) {
                  continue;
                }
              
                console.log(curriculum.courses);
                Departmentcourses.push(curriculum.courses);
              }


          // return Departmentcourses


           for (const array of Departmentcourses) {
            for (const course of array) {
            if (course.semester === highestSemester) {
                courses.push(course.courseId);
            }
            }
        }

       // return courses;


        for(const course of courses) {

            const status = await checkPrerequisite(course,student_id)

            if(status == true)
                {
                    PossibleCourse.push(course)
                }

            
                //PossibleCourse.push(status)
            
           
           





        }
        return PossibleCourse;

   



  }



  











}


module.exports =  getPossibleAddCourses;