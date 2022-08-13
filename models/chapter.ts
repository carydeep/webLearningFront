import { Lesson } from "./lesson"

export interface Chapter{
    _id:string,
    name:string,
    slug:string,
    lessons:Lesson[]
}

export interface AddChapter{
    name:string
}