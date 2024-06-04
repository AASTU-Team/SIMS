export type CourseFields = {
    _id?: string;
    name?: string;
    department_id?: string;
    instructors?: string[];
    credits?: number;
    prerequisites?: string[];
    type?: string;
    code?: string;
    lec?: string;
    lab?: string;
    tut?: string;
    option?:string;
    hs?:string;
    description?: string;
    
};

export type Assessments = {
    id:string;
    name?:string;
    value?:number;
}
