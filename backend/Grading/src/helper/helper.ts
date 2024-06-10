import mongoose from 'mongoose';
import Grade from '../models/grade.model';
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

            const updateResult = await Grade.updateMany(
                { student_id: { $in: studentIds }, course_id: course_id, year: year, semester: semester },
                { $set: { instructor_id: instructor_id } }
            );

            console.log(`Instructor ${instructor_id} updated for ${updateResult} students in course ${course_id}.`);
        }
    } catch (error) {
        return
    }
};