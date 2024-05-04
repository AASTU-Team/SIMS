const Student = require("../models/student.model");
const Curriculum = require("../models/curriculum.model");
const Registration = require("../models/registration.model");


  async function assignCourse(Ids:String[]): Promise<any> {
    const courses:any[] = []
    const success:any = []

    const freshmancurriculum = await Curriculum.findOne({name:"Freshman"})

    if(!freshmancurriculum){

        return []
    }

    const freshmanCourses:any[] = freshmancurriculum.courses

    freshmanCourses.map(course=>{

        if(course.semester === 1)
            {
                courses.push({
                    
                    
                    courseID:course.courseId,
                    grade:"",
                    status:"Active",
                    isRetake:false
                
                })
            }
    })

    Ids.map(studentId=>{

        const registration = new Registration({
            stud_id: studentId,
            year:1,
            semester:1,
            courses:courses,
            registration_date: new Date()
           // section_id:"",
           
        })

        registration.save()

        if(registration)
            {
                success.push(studentId)
            }



       




    })

    return success






}


module.exports =  assignCourse
   


