import mongoose, {
  Schema,
  Document,
  Model,
  Types,
  HydratedDocument,
} from "mongoose";
const Joi = require("joi");

// Define the interface for the document
interface IAttendance {
  
  student_id: mongoose.Types.ObjectId;
  course_id: mongoose.Types.ObjectId;
  instructor_id: mongoose.Types.ObjectId;
 // semester_id: Number;
  date: Date;
  status: "Present" | "Absent" | "Late" | "Excused";
}
interface IAttendanceMethods {
  // generateAuthTokens(): Promise<{}>;
}
type AttendanceModel = Model<IAttendance, {}, IAttendanceMethods>;
// Define the schema
const AttendacneSchema: Schema = new Schema<
  IAttendance,
  AttendanceModel,
  IAttendance
>({
 
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
    ref: "Instructor",
    required: true,
  },
 /*  semester_id: {
    type:Number,
   // ref: "Semester",
    required: true,
  }, */
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late", "Excused"],
    required: true,
  },
});
function validateAttendance(attendance: Document) {
  const schema = Joi.object({
    attendance_id: Joi.number().required(),
    student_id: Joi.string().required(),
    course_id: Joi.string().required(),
    instructor_id: Joi.string().required(),
    //semester_id: Joi.string().required(),
    date: Joi.date().required(),
    status: Joi.string()
      .valid("Present", "Absent", "Late", "Excused")
      .required(),
  });
  return schema.validate(attendance);
}
// Create and export the model
AttendacneSchema.method("smFun", async function SomeFunction() {});

const Attendacne = mongoose.model<IAttendance, AttendanceModel>(
  "Attendance",
  AttendacneSchema
);
export default Attendacne;

// async function addAttendance(attendace: IAttendance): Promise<any> {
//   const attendanceResult = new Attendacne(attendance);
//   try {
//     await attendanceResult.save();
//     return {
//     };
//   } catch (error: unknown) {
//     return (error as Error).message;
//   }
// }

export //addAttendance
 {};
