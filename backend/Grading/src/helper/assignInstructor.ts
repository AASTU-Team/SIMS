const Assignment = require('../models/Assignment.model')
import Grade from '../../models/grade.model';
import Student from '../../models/student.model';
import Registration from '../../models/registration.model';
import assignInstructor from '../../helper/assignInstructor';

async function assignInstructor(Stud_id: any, courses: any[]): Promise<any> {

    const error: any = []
    const success: any = []

    const student = await Student.findById(Stud_id)
    if (!student) return
    const year = student.semester
    const semester = student.semester

    const registration = await Registration.findOne({ stud_id: Stud_id, semester: semester, year: year })
    if (!registration) return

    const section_id = registration.section_id

    for (const course of courses) {
        const assignment = await Assignment.findOne({ course_id: course, section_id: section_id })
        if (!assignment) return
        const instructor_id = assignment.instructor_id

        const updateGrade = await Grade.findOneAndUpdate({ student_id: Stud_id, course_id: course }, { instructor_id: instructor_id })
        if (!updateGrade) error.push(course)
        else {
            success.push(course)
        }
    }
}

export default assignInstructor;