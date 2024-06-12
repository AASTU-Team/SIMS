import { CourseFields } from "./course";

export type CurriculumFields = {
  name?: string;
  department_id?: string;
  credits_required?: number;
  semester?: string;
  year?: string;
  courses?: CourseFields[];
  type?: string;
  description?: string;
  _id?: string;
};
