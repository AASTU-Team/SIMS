import mongoose from 'mongoose';
const Grade = require('../../models/grade.model');
const NumberOfStudent  = require('../../models/numberOfStudent.model');
const Assignment = require('../../models/Assignment.model');  // Ensure paths are correct

// Function to set up watcher on the Assignment collection
export const setupAssignmentWatcher = () => {
    const assignmentChangeStream = Assignment.watch();

    assignmentChangeStream.on('change', async (change: any) => {
        console.log('Change detected:', change);
        if (change.operationType === 'insert' || change.operationType === 'update') {
            const { course_id, section_id, instructor_id } = change.fullDocument;

            try {
                const numberOfStudents = await NumberOfStudent.findOne({ course_id, section_id });
                if (!numberOfStudents) return;

                const studentIds = numberOfStudents.numberOfStudent.map((entry : any) => entry.student);
                
                await Grade.updateMany(
                    { student_id: { $in: studentIds }, course_id: course_id },
                    { $set: { instructor_id: instructor_id } }
                );
                console.log(`Instructor updated for ${studentIds.length} students.`);
            } catch (error) {
                console.error('Error processing change:', error);
            }
        }
    });
};
