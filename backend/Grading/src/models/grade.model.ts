import mongoose, { Document, Schema } from "mongoose";

interface StudentAssessment {
  assessment_id: string;
  name: string;
  value: number;
  completed?: boolean;
  marks_obtained?: number;
  filled_at?: Date;
  feedback?: string;
}

interface GradeDocument extends Document {
  student_id: mongoose.Types.ObjectId;
  course_id: mongoose.Types.ObjectId;
  instructor_id: mongoose.Types.ObjectId;
  assessments: StudentAssessment[];
  total_score: number;
  grade: string;
  calculateTotalScore(): void;
}

const studentAssessmentSchema = new Schema<StudentAssessment>({
  assessment_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  marks_obtained: {
    type: Number,
    required: false,
    default: 0
  },
  filled_at: {
    type: Date,
    required: false,
  },
  feedback: {
    type: String,
    required: false,
  }
});

const gradeSchema = new Schema<GradeDocument>({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  instructor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  assessments: {
    type: [studentAssessmentSchema],
    required: true,
  },
  total_score: {
    type: Number,
    required: false,
    default: 0,
  },
  grade: {
    type: String,
    required: false,
  },
});

gradeSchema.methods.calculateTotalScore = function() {
  let totalScore = 0;
  let allCompleted = true;
  
  this.assessments.forEach((assessment: any) => {
    if (assessment.completed) {
      totalScore += assessment.marks_obtained || 0;
    } else {
      allCompleted = false;
    }
  });

  this.total_score = totalScore;

  if (!allCompleted) {
    this.grade = 'NG';
  } else {
    if (totalScore >= 90) this.grade = 'A+';
    else if (totalScore >= 85) this.grade = 'A';
    else if (totalScore >= 80) this.grade = 'A-';
    else if (totalScore >= 75) this.grade = 'B+';
    else if (totalScore >= 70) this.grade = 'B';
    else if (totalScore >= 65) this.grade = 'B-';
    else if (totalScore >= 60) this.grade = 'C+';
    else if (totalScore >= 55) this.grade = 'C';
    else if (totalScore >= 50) this.grade = 'C-';
    else this.grade = 'F';
  }
};

gradeSchema.pre<GradeDocument>('save', function(next) {
  this.calculateTotalScore();
  next();
});

const Grade = mongoose.model<GradeDocument>("Grade", gradeSchema);

export default Grade;
