import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Grade from '../../models/grade.model';
import Course from '../../models/course.model';
import Student from '../../models/student.model';
import ApprovalProcess from '../../models/approvalProcess.model';
import { assign } from '../../helper/helper';

class GradeController {
    // Create a grade document for a student in a course
    static async createGrade(req: Request, res: Response) {
        const { courseId, studentId, instructorId } = req.body;

        try {
            // Find the course and populate the assessments
            const course = await Course.findById(courseId).populate('assessments');
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            // Initialize assessments from the course assessments
            const assessments = course.assessments.map((assessment: any) => ({
                assessment_id: assessment._id,
                name: assessment.name,
                value: assessment.value,
                completed: false,
                marks_obtained: 0
            }));

            // Create the grade document
            const newGrade = new Grade({
                student_id: new mongoose.Types.ObjectId(studentId),
                course_id: new mongoose.Types.ObjectId(courseId),
                instructor_id: new mongoose.Types.ObjectId(instructorId),
                assessments,
                total_score: 0,
                grade: 'NG'  // Not Graded initially
            });

            await newGrade.save();
            return res.status(201).json({ newGrade, message: 'Grade document created successfully' });
        } catch (error) {
            console.error('Error creating grade document:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Create grade documents for multiple students and their courses
    static async createGradesForStudents(req: Request, res: Response) {
        const studentsData = req.body.students;

        try {
            for (const studentData of studentsData) {
                const { studentId, courses } = studentData;

                for (const courseData of courses) {
                    const { course_id } = courseData;

                    const course = await Course.findById(course_id).populate('assessments');
                    if (!course) {
                        return res.status(404).json({ error: `Course not found: ${course_id}` });
                    }

                    const assessments = course.assessments.map((assessment: any) => ({
                        assessment_id: assessment._id,
                        name: assessment.name,
                        value: assessment.value,
                        completed: false,
                        marks_obtained: 0
                    }));

                    const newGrade = new Grade({
                        student_id: new mongoose.Types.ObjectId(studentId),
                        course_id: new mongoose.Types.ObjectId(course_id),
                        assessments,
                        total_score: 0,
                        grade: 'NG'
                    });

                    await newGrade.save();
                }
            }

            return res.status(201).json({ message: 'Grade documents created successfully' });
        } catch (error) {
            console.error('Error creating grade documents:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateAssessment(req: Request, res: Response) {
        const { gradeId, assessmentId } = req.params;
        const { marks_obtained, feedback } = req.body;

        try {
            // Find the grade document by ID
            const grade = await Grade.findById(gradeId);
            if (!grade) {
                return res.status(404).json({ error: 'Grade not found' });
            }

            const approvalProcess = await ApprovalProcess.findOne({ grade_id: gradeId }).exec();
            if (approvalProcess && (approvalProcess.status === 'Pending' || approvalProcess.status === 'Approved')) {
                return res.status(400).json({ error: 'Grade cannot be updated while approval is pending or already approved.' });
            }

            // Find the assessment within the assessments array
            const assessment = grade.assessments.find((assess: any) => assess.assessment_id === assessmentId);
            if (!assessment) {
                return res.status(404).json({ error: 'Assessment not found' });
            }

            // Check if the updateData contains marks_obtained
            if (marks_obtained !== undefined) {
                if (marks_obtained > assessment.value) {
                    return res.status(400).json({ error: 'marks_obtained cannot be greater than the assessment value' });
                }
                else {
                    assessment.marks_obtained = marks_obtained;
                    assessment.completed = true;
                }
            }
            else {
                assessment.marks_obtained = 0;
                assessment.completed = false;
            }

            if (feedback !== undefined) {
                assessment.feedback = feedback;
            }

            // Save the updated grade document
            await grade.save();

            return res.status(200).json({ message: 'Assessment updated successfully', grade });
        } catch (error) {
            console.error('Error updating assessment:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // get grades for a course id
    static async getGradesByCourse(req: Request, res: Response) {
        const { courseId } = req.params;

        await assign();
        try {
            // Find all grades for the given course
            const grades = await Grade.find({ course_id: courseId }).populate('student_id');

            if (!grades || grades.length === 0) {
                return res.status(404).json({ error: 'No grades found for this course' });
            }

            // Prepare the response data
            const studentGrades = [];
            for (const grade of grades) {
                const studentDoc = grade.student_id as any;

                const approvalProcess = await ApprovalProcess.findOne({ grade_id: grade._id }).exec();
                let approvalStatus = 'Uninitiated';
                if (approvalProcess) {
                    approvalStatus = approvalProcess.status;
                }

                studentGrades.push({
                    studentId: studentDoc?._id,
                    studentName: studentDoc?.name,
                    assessments: grade.assessments,
                    totalScore: grade.total_score,
                    grade: grade.grade,
                    instructorId: grade.instructor_id,
                    approval_status: approvalStatus
                });
            }

            return res.status(200).json({
                courseId,
                students: studentGrades
            });
        } catch (error) {
            console.error('Error fetching grades by course:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getFilteredCourses(req: Request, res: Response) {
        const { instructorId } = req.params;
        const { sectionId, courseId, semester, year } = req.query;

        try {
            await assign();

            const gradeFilter: any = { instructor_id: instructorId };
            if (courseId) {
                gradeFilter.course_id = courseId;
            }

            let studentIds: mongoose.Types.ObjectId[] = [];

            if (semester || year) {
                const studentFilter: any = {};
                if (semester) {
                    studentFilter.semester = semester;
                }
                if (year) {
                    studentFilter.year = year;
                }

                const students = await Student.find(studentFilter);
                if (students.length === 0) {
                    return res.status(404).json({ error: 'No students found for these filters' });
                }

                studentIds = students.map(student => student._id);
                gradeFilter.student_id = { $in: studentIds };
            }

            const grades = await Grade.find(gradeFilter).populate('course_id').populate('student_id');

            if (!grades || grades.length === 0) {
                return res.status(404).json({ error: 'No grades found for these filters' });
            }

            const results = [];
            for (const grade of grades) {
                const course = grade.course_id as any;
                const student = grade.student_id as any;

                const approvalProcess = await ApprovalProcess.findOne({ grade_id: grade._id }).exec();
                let approvalStatus = 'Uninitiated';
                if (approvalProcess) {
                    approvalStatus = approvalProcess.status;
                }

                results.push({
                    courseId: course?._id,
                    courseName: course?.name,
                    studentId: student?._id,
                    studentName: student?.name,
                    assessments: grade.assessments,
                    totalScore: grade.total_score,
                    gradeId: grade._id,
                    grade: grade.grade,
                    approval_status: approvalStatus,
                    instructorId: grade.instructor_id
                });
            }

            return res.status(200).json(results);
        } catch (error) {
            console.error('Error fetching filtered grades:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get students by course and instructor, and assign instructors if missing
    static async getStudentsByCourseAndInstructor(req: Request, res: Response) {
        const { courseId, instructorId } = req.params;
        await assign();
        try {
            // Find the course
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            // Find all grades for the given course with the specified instructor
            const grades = await Grade.find({ course_id: courseId, instructor_id: instructorId }).populate('student_id');

            if (!grades || grades.length === 0) {
                return res.status(404).json({ error: 'No grades found for this course and instructor' });
            }

            // Prepare the response data
            const studentGrades = [];
            for (const grade of grades) {
                const student = grade.student_id as any;

                const approvalProcess = await ApprovalProcess.findOne({ grade_id: grade._id }).exec();
                let approvalStatus = 'Uninitiated';
                if (approvalProcess) {
                    approvalStatus = approvalProcess.status;
                }

                studentGrades.push({
                    studentId: student?._id,
                    studentName: student?.name,
                    assessments: grade.assessments,
                    totalScore: grade.total_score,
                    grade: grade.grade,
                    instructorId: grade.instructor_id,
                    approval_status: approvalStatus
                });
            }

            return res.status(200).json({
                courseId: course._id,
                courseName: course.name,
                students: studentGrades
            });
        } catch (error) {
            console.error('Error fetching students by course:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async calculateGPAs(req: Request, res: Response) {
        const studentsData = req.body.students;
        try {
            const results: any[] = [];

            for (const studentData of studentsData) {
                const { studentId, courses } = studentData;
                const student = await Student.findById(studentId);

                if (!student) {
                    results.push({
                        studentId,
                        error: 'Student not found'
                    });
                    continue;
                }

                let totalScore = 0;
                let totalCredits = 0;
                const courseGrades: any[] = [];

                for (const courseData of courses) {
                    const { courseId } = courseData;
                    const course = await Course.findById(courseId);

                    if (!course) {
                        courseGrades.push({ courseId, error: 'Course not found' });
                        continue;
                    }

                    const gradeDoc = await Grade.findOne({ student_id: studentId, course_id: courseId });

                    if (!gradeDoc) {
                        courseGrades.push({ courseId, error: 'Grade not found' });
                        continue;
                    }

                    const approvalProcess = await ApprovalProcess.findOne({ grade_id: gradeDoc._id }).exec();
                    if (!approvalProcess || approvalProcess.status !== 'Approved') {
                        courseGrades.push({ courseId: course._id, courseName: course.name, grade: 'NG' });
                        continue;
                    }

                    const courseCredit = course.credits;
                    const grade = gradeDoc.grade;

                    if (grade !== 'NG') {
                        let score = 0;
                        switch (grade) {
                            case 'A+': score = 4.0; break;
                            case 'A': score = 4.0; break;
                            case 'A-': score = 3.75; break;
                            case 'B+': score = 3.5; break;
                            case 'B': score = 3.0; break;
                            case 'B-': score = 2.75; break;
                            case 'C+': score = 2.5; break;
                            case 'C': score = 2.0; break;
                            case 'C-': score = 1.75; break;
                            case 'F': score = 0.0; break;
                            default: score = 0.0; break;
                        }

                        totalScore += score * courseCredit;
                        totalCredits += courseCredit;
                        courseGrades.push({ courseId: course._id, courseName: course.name, grade });
                    } else {
                        courseGrades.push({ courseId: course._id, courseName: course.name, grade: 'NG' });
                    }
                }

                const semesterGPA = totalCredits > 0 ? totalScore / totalCredits : 0.0;

                results.push({
                    studentId: student._id,
                    studentName: student.name,
                    totalCredits,
                    semesterGPA,
                    courseGrades
                });
            }

            return res.status(200).json(results);
        } catch (error) {
            console.error('Error calculating GPAs:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    // Get all grades for a specific student
    static async getGrades(req: Request, res: Response) {
        const { studentId } = req.params;

        await assign();

        try {
            const grades = await Grade.find({ student_id: studentId }).populate('course_id');

            const gradesWithApprovalStatus = await Promise.all(grades.map(async (grade) => {
                const approvalProcess = await ApprovalProcess.findOne({ grade_id: grade._id }).exec();
                let approvalStatus = 'Uninitiated';
                if (approvalProcess) {
                    approvalStatus = approvalProcess.status;
                }
                return {
                    ...grade.toObject(),
                    approvalStatus
                };
            }));

            return res.status(200).json(gradesWithApprovalStatus);
        } catch (error) {
            console.error('Error getting grades:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get a specific grade for a student in a course
    static async getGrade(req: Request, res: Response) {
        const { studentId, courseId } = req.params;

        await assign();
        try {
            const grade = await Grade.findOne({ student_id: studentId, course_id: courseId }).populate('course_id');
            if (!grade) {
                return res.status(404).json({ error: 'Grade not found' });
            }

            // Fetch the approval status for the grade
            const approvalProcess = await ApprovalProcess.findOne({ grade_id: grade._id }).exec();
            let approvalStatus = 'Uninitiated';
            if (approvalProcess) {
                approvalStatus = approvalProcess.status;
            }

            // Add the approval status to the grade response
            const gradeWithApprovalStatus = {
                ...grade.toObject(),
                approvalStatus
            };

            return res.status(200).json(gradeWithApprovalStatus);
        } catch (error) {
            console.error('Error getting grade:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default GradeController;
