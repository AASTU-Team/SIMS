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
  addStatus?:boolean;
  regStatus?:boolean;
}

export interface SectionFields {
  key: string;
  name: string;
  enrolled: string;
  staff?:string;
}