export interface StudentFields {
    id: string;
    name: string;
    email: string;
    department_id: string;
    year: number;
    admission_date: Date | string;
    grad_date?: Date | string;
    contact: string;
    address: string;
    emergencycontact_name: string;
    emergencycontact_phone: string;
    emergencycontact_relation: string;
}