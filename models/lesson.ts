import { Chapter } from "./chapter"

export interface Lesson{
    _id:string,
    name:string,
    slug:string,
    content?:Content[]
}

export interface AddLessonSlices{
    chapter:Chapter,
    idchapter:string,
    idcourse:string
}

export interface UpdateLessonSlices{
    idchapter:string,
    idcourse:string,
    idlesson:string,
    name:string
}

export interface AddLessonApi{
    name:string
}

export interface AddContentApi{
    type:'text'|'playground',
    value?:string,
    button?:boolean,
    language?:string
}

export interface Content{
    _id:string,
    type:'text'|'playground',
    value:string,
    button?:boolean,
    language?:string
}

export interface AddContentSlices{
    idchapter:string,
    idcourse:string,
    idlesson:string,
    lesson:Lesson
}

export interface updateContentApi{
    value:string,
    button?:boolean,
    language?:string
}