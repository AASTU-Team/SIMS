export type StaffFields = {
    _id?: string;
    name?: string;
    email?: string;
    department_id?: string;
    phone?: string;
    address?: string;
    birthday?: Date | string;
    gender?: 'MALE' | 'FEMALE';
    role?: Array<string>;
    hireDate?: Date;
    status?: string;
};
