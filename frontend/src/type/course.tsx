export type CourseFields = {
    _id?: string;
    name?: string;
    department_id?: string;
    instructors?: string[];
    credits?: number;
    prerequisites?: CourseFields[];
    type?: string;
    code?: string;
    lec?: string;
    lab?: string;
    tut?: string;
    option?:string;
    hs?:string;
    class?:string;
    description?: string;
    assessments?: Assessments[];
    
};

export type Assessments = {
    id:string;
    name?:string;
    value?:number;
}
