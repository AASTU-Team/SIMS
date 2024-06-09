import { Request, Response } from 'express';
import Grade from '../../models/grade.model';
import Course from '../../models/course.model';
import Student from '../../models/student.model';
import Registration from '../../models/registration.model';

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
            console.log(course);

            //   // Initialize assessments from the populated course assessments
            //   const assessments = course.assessments.map((assessment: any) => ({
            //     assessment_id: assessment._id,
            //     name: assessment.name,
            //     value: assessment.value,
            //     completed: false,
            //     marks_obtained: 0
            //   }));

            //   // Create the grade document
            //   const newGrade = new Grade({
            //     student_id: new mongoose.Types.ObjectId(studentId),
            //     course_id: new mongoose.Types.ObjectId(courseId),
            //     assessments,
            //     total_score: 0,
            //     grade: 'NG'  // Not Graded initially
            //   });

            //   await newGrade.save();
            //   return res.status(201).json({ message: 'Grade document created successfully', gassessments });
            return res.status(201).json({ message: 'Grade document created successfully' });


        } catch (error) {
            console.error('Error creating grade document:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateAssessment(req: Request, res: Response) {
        const { gradeId, assessmentId } = req.params;
        const updateData = req.body;

        try {
            // Find the grade document by ID
            const grade = await Grade.findById(gradeId);
            if (!grade) {
                return res.status(404).json({ error: 'Grade not found' });
            }
            // Find the assessment within the assessments array
            const assessment = grade.assessments.find(assess => assess.assessment_id === assessmentId);
            if (!assessment) {
                return res.status(404).json({ error: 'Assessment not found' });
            }

            // Check if the updateData contains marks_obtained
            if (updateData.marks_obtained !== undefined) {
                if (updateData.marks_obtained > assessment.value) {
                    return res.status(400).json({ error: 'marks_obtained cannot be greater than the assessment value' });
                }
            }

            // Update the assessment fields
            Object.keys(updateData).forEach(key => {
                if (updateData.hasOwnProperty(key)) {
                    (assessment as any)[key] = updateData[key];
                }
            });

            // Save the updated grade document
            await grade.save();

            return res.status(200).json({ message: 'Assessment updated successfully', grade });

        } catch (error) {
            console.error('Error updating assessment:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Filter courses taught by the instructor with optional filters
    static async getFilteredCourses(req: Request, res: Response) {
        const { instructorId } = req.params;
        const { sectionId, courseId, semester, year } = req.query;

        try {
            // Build the course filter query
            const courseFilter: any = { instructors: { $in: [instructorId] } };
            if (courseId) {
                courseFilter._id = courseId;
            }

            // Find the courses taught by the instructor
            const courses = await Course.find(courseFilter);
            if (!courses || courses.length === 0) {
                return res.status(404).json({ error: 'No courses found for this instructor' });
            }

            // Get the course IDs
            const courseIds = courses.map(course => course._id);

            // Build the registration filter query
            const registrationFilter: any = {
                'courses.courseID': { $in: courseIds },
            };
            if (sectionId) {
                registrationFilter.section_id = sectionId;
            }
            if (semester) {
                registrationFilter.semester = semester;
            }
            if (year) {
                registrationFilter.year = year;
            }

            // Find the registrations matching the filter
            const registrations = await Registration.find(registrationFilter).populate('stud_id courses.courseID');
            if (!registrations || registrations.length === 0) {
                return res.status(404).json({ error: 'No students found for these courses' });
            }

            // Prepare the response data
            const results = registrations.map(registration => {
                const student = registration.stud_id as any;  // Assuming stud_id is populated
                const studentCourses = registration.courses.map((course: any) => {
                    const courseDetails = course.courseID as any;  // Assuming courseID is populated
                    return {
                        courseId: courseDetails._id,
                        courseName: courseDetails.name,
                        sectionId: course.section,
                        grade: course.grade,
                        status: course.status,
                    };
                });
                return {
                    studentId: student._id,
                    studentName: student.name,
                    year: registration.year,
                    semester: registration.semester,
                    courses: studentCourses,
                };
            });

            return res.status(200).json(results);

        } catch (error) {
            console.error('Error fetching filtered courses:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getStudentsByCourseAndInstructor(req: Request, res: Response) {
        const { courseId } = req.params;

        try {
            // Find the course
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            // Find all grades for the given course
            const grades = await Grade.find({ course_id: courseId }).populate('student_id');

            if (!grades || grades.length === 0) {
                return res.status(404).json({ error: 'No grades found for this course' });
            }

            // Prepare the response data
            const studentGrades = grades.map(grade => {
                const student = grade.student_id as any;  // Assuming student_id is populated
                return {
                    studentId: student._id,
                    studentName: student.name,
                    assessments: grade.assessments,
                    totalScore: grade.total_score,
                    grade: grade.grade
                };
            });

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
        console.log("studentsData",req.body);
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

                    const courseCredit = course.credits;
                    const grade = gradeDoc.grade;

                    if (grade !== 'NG') {
                        let score = 0;
                        switch (grade) {
                            case 'A+': score = 4.0; break;
                            case 'A': score = 4.0; break;
                            case 'A-': score = 3.7; break;
                            case 'B+': score = 3.3; break;
                            case 'B': score = 3.0; break;
                            case 'B-': score = 2.7; break;
                            case 'C+': score = 2.3; break;
                            case 'C': score = 2.0; break;
                            case 'C-': score = 1.7; break;
                            case 'F': score = 0.0; break;
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

        try {
            const grades = await Grade.find({ student_id: studentId }).populate('course_id');
            return res.status(200).json(grades);

        } catch (error) {
            console.error('Error getting grades:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get a specific grade for a student in a course
    static async getGrade(req: Request, res: Response) {
        const { studentId, courseId } = req.params;

        try {
            const grade = await Grade.findOne({ student_id: studentId, course_id: courseId }).populate('course_id');
            if (!grade) {
                return res.status(404).json({ error: 'Grade not found' });
            }
            return res.status(200).json(grade);

        } catch (error) {
            console.error('Error getting grade:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default GradeController;