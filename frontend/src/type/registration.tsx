import { CourseFields } from "./course";

export interface SlipDetails {
  stream?: string;
  classification?: string;
  program?: string;
  ac_year?: string;
  year?: string;
  sem?: string;
  name?:string;
  student_id?:string;
  type?:string;
  reason?:string;
}

export interface SemesterDetails {
  id?: string;
  batches?: Array<string>;
  program?: string;
  semester?: string;
  start_date?: string;
  end_date?: string;
  academic_year?: string;
  status?: string;
  _id?:string;
  addStatus?:string;
  regStatus?:string;
}

export interface SectionFields {
  _id: string;
  key?: string;
  name?: string;
  enrolled?: string;
  section_id?: string;
  type?:string;
  staff?:string;
  instructor?:string;
}

export interface RegistrationFields {
  key: number;
  name: string;
  email?: string;
  phone?: string;
  reason?:string;
  id?: string;
  type?: string;
  year?: number;
  semester?: number;
  total_credit?: number;
  registration_date?: string;
  courses?: { courseID: CourseFields }[];
  _id: string;
}

export interface StudentApproval{
  name?:string;
  student_id?:string;
  grade?:string;
  attendance?:string;
  grade_id?:string;
  
}

export interface GradeApproval {
  instructor_name?:string;
  course_name?:string;
  code?:string;
  request_date?:string;
  students?:StudentApproval[];
  key?:string;
}
