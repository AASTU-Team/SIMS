import supertest from 'supertest';
import app from '../../app';  // Import your Express app

const request = supertest(app);

describe("Grade Management", () => {
  let courseId: string;
  let studentId: string;
  let instructorId: string;
  let gradeId: string;
  let assessmentId: string;

  beforeAll(async () => {
    // Create sample data using endpoints
    const courseResponse = await request
      .post("/courses")
      .set("Content-Type", "application/json")
      .send({ name: 'Sample Course', instructors: [], assessments: [] });
    courseId = courseResponse.body.course._id;

    const studentResponse = await request
      .post("/students")
      .set("Content-Type", "application/json")
      .send({ name: 'John Doe' });
    studentId = studentResponse.body.student._id;

    const instructorResponse = await request
      .post("/instructors")
      .set("Content-Type", "application/json")
      .send({ name: 'Jane Smith' });
    instructorId = instructorResponse.body.instructor._id;

    const gradeResponse = await request
      .post("/grades")
      .set("Content-Type", "application/json")
      .send({ courseId, studentId, instructorId });
    gradeId = gradeResponse.body.grade._id;

    const assessmentResponse = await request
      .post(`/grades/${gradeId}/assessments`)
      .set("Content-Type", "application/json")
      .send({ assessment_id: 'sampleAssessment', name: 'Midterm', value: 50 });
    assessmentId = assessmentResponse.body.assessment._id;
  });

  afterAll(async () => {
    // Cleanup sample data using endpoints
    await request.delete(`/courses/${courseId}`);
    await request.delete(`/students/${studentId}`);
    await request.delete(`/instructors/${instructorId}`);
    await request.delete(`/grades/${gradeId}`);
  });

  describe("Create Grade", () => {
    it("should create a grade document successfully", async () => {
      const response = await request
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

      const response = await request
        .put(`/grades/${gradeId}/assessments/${assessmentId}`)
        .set("Content-Type", "application/json")
        .send(updateData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("message", "Assessment updated successfully");
    });

    it("should return a 400 error for marks_obtained greater than assessment value", async () => {
      const updateData = { marks_obtained: 55 };

      const response = await request
        .put(`/grades/${gradeId}/assessments/${assessmentId}`)
        .set("Content-Type", "application/json")
        .send(updateData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error", "marks_obtained cannot be greater than the assessment value");
    });
  });

  describe("Get Grades", () => {
    it("should retrieve all grades for a specific student", async () => {
      const response = await request.get(`/grades/${studentId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should retrieve a specific grade for a student in a course", async () => {
      const response = await request.get(`/grades/${studentId}/${courseId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("course_id");
      expect(response.body).toHaveProperty("student_id");
    });
  });

  describe("Get Filtered Courses", () => {
    it("should retrieve all students with their assessments and grades for a given course and optional filters", async () => {
      const response = await request.get(`/instructor/${instructorId}/courses`);

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

      const response = await request
        .post("/calculateGPAs")
        .set("Content-Type", "application/json")
        .send({ students: studentsData });

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe("Get Students by Course and Instructor", () => {
    it("should retrieve all students with their assessments and grades for a given course and instructor", async () => {
      const response = await request.get(`/courses/${courseId}/students`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("courseId");
      expect(response.body).toHaveProperty("students");
      expect(response.body.students).toBeInstanceOf(Array);
    });
  });
});
