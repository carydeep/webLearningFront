import { Chapter } from "./chapter"

export interface Course{
    _id:string,
    name:string,
    author:string,
    slug:string,
    icon:string,
    group:string,
    topics:string[],
    chapters:Chapter[],
    public:boolean,
    createdAt?: string,
    updatedAt: string,
    __v?: number,
}

export interface AddCourse{
    name:string,
    group:string,
    icon:string,
    topics:string[]
}

export interface UpdateCourse{
    name:string,
    group:string,
    icon:string,
    topics:string[]
}