import mongoose from 'mongoose';
import Grade from '../models/grade.model';
import Course from '../models/course.model';
const Assignment = require('../models/Assignment.model');
const NumberOfStudent = require('../models/numberOfStudent.model');

export const assign = async () => {
    try {
        const assignments = await Assignment.find();

        for (const assignment of assignments) {
            const { course_id, section_id, instructor_id, year, semester } = assignment;

            const numberOfStudents = await NumberOfStudent.findOne({ course_id, section_id });
            if (!numberOfStudents) {
                continue;
            }

            const studentIds = numberOfStudents.numberOfStudent.map((entry: any) => entry.student);

            for (const studentId of studentIds) {
                let grade = await Grade.findOne({ student_id: studentId, course_id: course_id });

                if (!grade) {
                    const course = await Course.findById(course_id).populate('assessments');
                    if (!course) {
                        console.error(`Course not found: ${course_id}`);
                        continue;
                    }

                    const assessments = course.assessments.map((assessment: any) => ({
                        assessment_id: assessment._id,
                        name: assessment.name,
                        value: assessment.value,
                        completed: false,
                        marks_obtained: 0
                    }));

                    grade = new Grade({
                        student_id: new mongoose.Types.ObjectId(studentId),
                        course_id: new mongoose.Types.ObjectId(course_id),
                        instructor_id: new mongoose.Types.ObjectId(instructor_id),
                        assessments,
                        total_score: 0,
                        grade: 'NG'
                    });

                    await grade.save();
                } else {
                    grade.instructor_id = instructor_id;
                    await grade.save();
                }
            }
        }
    } catch (error) {
        return
    }
};