export interface StudentFields {
  id: string;
  name: string;
  email: string;
  birthday: Date | string;
  department_id: string;
  year: number;
  admission_date: Date | string;
  grad_date?: Date | string;
  contact?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE";
  address: string;
  emergencycontact_name: string;
  emergencycontact_phone: string;
  emergencycontact_relation: string;
  status: string;
}