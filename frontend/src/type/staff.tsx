export type StaffFields = {
    name?: string;
    email?: string;
    department_id?: string;
    phone?: string;
    address?: string;
    birthday?: Date | string;
    gender?: 'MALE' | 'FEMALE';
    id?: number;
    role?: Array<string>;
    salary?: number;
    hireDate?: Date;
};
