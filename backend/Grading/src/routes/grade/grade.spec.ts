import request from 'supertest';
import app from '../../app';  // Import your Express app
import mongoose from 'mongoose';
import Grade from '../../models/grade.model';
import Course from '../../models/course.model';
import Student from '../../models/student.model';
import Registration from '../../models/registration.model';

const baseUrl = "http://localhost:4000";

describe("Grade Management", () => {
  let courseId: string;
  let studentId: string;
  let instructorId: string;
  let gradeId: string;
  let assessmentId: string;

  beforeAll(async () => {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || '', {
      // Use the default options without specifying useNewUrlParser and useUnifiedTopology
    });
    
    // Create sample data
    const course = await Course.create({ name: 'Sample Course', instructors: [], assessments: [] });
    courseId = course._id.toString();

    const student = await Student.create({ name: 'John Doe' });
    studentId = student._id.toString();

    const instructor = await Student.create({ name: 'Jane Smith' });  // Assuming instructors are stored in the same collection
    instructorId = instructor._id.toString();

    const grade = await Grade.create({ student_id: student._id, course_id: course._id, assessments: [], total_score: 0, grade: 'NG' });
    gradeId = grade._id.toString();

    const assessment = { assessment_id: 'sampleAssessment', name: 'Midterm', value: 50, completed: false, marks_obtained: 0 };
    grade.assessments.push(assessment);
    await grade.save();
    assessmentId = assessment.assessment_id;
  });

  afterAll(async () => {
    // Cleanup sample data
    await Course.deleteMany({});
    await Student.deleteMany({});
    await Grade.deleteMany({});
    await Registration.deleteMany({});
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
  });

  describe("Create Grade", () => {
    it("should create a grade document successfully", async () => {
      const response = await request(baseUrl)
        .post("/grades")
        .set("Content-Type", "application/json")
        .send({ courseId, studentId, instructorId });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message", "Grade document created successfully");
    });
  });

  describe("Update Assessment", () => {
    it("should update an assessment successfully", async () => {
      const updateData = { marks_obtained: 45 };

      const response = await request(baseUrl)
        .put(`/grades/${gradeId}/assessments/${assessmentId}`)
        .set("Content-Type", "application/json")
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Assessment updated successfully");
    });

    it("should return a 400 error for marks_obtained greater than assessment value", async () => {
      const updateData = { marks_obtained: 55 };

      const response = await request(baseUrl)
        .put(`/grades/${gradeId}/assessments/${assessmentId}`)
        .set("Content-Type", "application/json")
        .send(updateData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", "marks_obtained cannot be greater than the assessment value");
    });
  });

  describe("Get Grades", () => {
    it("should retrieve all grades for a specific student", async () => {
      const response = await request(baseUrl).get(`/grades/${studentId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should retrieve a specific grade for a student in a course", async () => {
      const response = await request(baseUrl).get(`/grades/${studentId}/${courseId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("course_id");
      expect(response.body).toHaveProperty("student_id");
    });
  });

  describe("Get Filtered Courses", () => {
    it("should retrieve all students with their assessments and grades for a given course and optional filters", async () => {
      const response = await request(baseUrl).get(`/instructor/${instructorId}/courses`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("Calculate GPAs", () => {
    it("should calculate GPAs for a list of students and their courses", async () => {
      const studentsData = [
        {
          studentId,
          courses: [{ courseId }]
        }
      ];

      const response = await request(baseUrl)
        .post("/calculateGPAs")
        .set("Content-Type", "application/json")
        .send({ students: studentsData });

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("Get Students by Course and Instructor", () => {
    it("should retrieve all students with their assessments and grades for a given course and instructor", async () => {
      const response = await request(baseUrl).get(`/courses/${courseId}/students`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("courseId");
      expect(response.body).toHaveProperty("students");
      expect(response.body.students).toBeInstanceOf(Array);
    });
  });
});
