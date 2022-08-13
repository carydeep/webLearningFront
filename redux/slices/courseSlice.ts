import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chapter } from "../../models/chapter";
import { Course } from "../../models/course";
import { AddContentSlices, AddLessonSlices, Lesson, UpdateLessonSlices } from "../../models/lesson";

interface CourseState{
    mycourse:Array<Course>|null,
    course:Array<Course>|null,
    loading:boolean,
    error:boolean
}

const initialState: CourseState = {
    mycourse:null,
    course:null,
    loading:false,
    error:false,
}

export const courseSlice = createSlice({
    name:'course',
    initialState,
    reducers:{
        startLoading:(state)=>{
            state.loading = true
        },
        fetchMyCourseSuccess:(state,action:PayloadAction<Array<Course>>)=>{
            state.loading = false
            state.error = false
            state.mycourse = action.payload
        },
        fetchMyCourseFail:(state)=>{
            state.loading = false
            state.error = true
        },
        deleteMyCourseSuccess:(state,action:PayloadAction<Course>)=>{
            state.loading = false
            const newMyCourse = state.mycourse?.filter(course=>course._id!==action.payload._id) || null
            state.mycourse = newMyCourse
            state.error = false
        },
        deleteMyCourseFail:(state)=>{
            state.loading = false
            state.error = true
        },
        updateMyCourseSuccess:(state,action:PayloadAction<Course>)=>{
            state.loading = false
            state.error = false
            const {_id,name,group,topics,icon,chapters} = action.payload
            const findIndex = state.mycourse?.findIndex(obj=>obj._id===_id)
            if(findIndex!==undefined && state.mycourse){
                state.mycourse[findIndex].name = name
                state.mycourse[findIndex].group = group
                state.mycourse[findIndex].topics =topics
                state.mycourse[findIndex].icon = icon
                state.mycourse[findIndex].chapters = chapters
                state.mycourse[findIndex].public = action.payload.public
            } 
        },
        updateMyCourseFail:(state)=>{
            state.loading = false
            state.error = true
        },
        addLessonToChapterSuccess:(state,action:PayloadAction<AddLessonSlices>)=>{
            state.loading = false
            state.error = false
            const {chapter,idchapter,idcourse} = action.payload
            const findIndexCourse = state.mycourse?.findIndex(course=>course._id===idcourse)
            if(findIndexCourse!==undefined && state.mycourse){
                const findIndexChapter = state.mycourse[findIndexCourse].chapters.findIndex(chapter=>chapter._id===idchapter)
                if(findIndexChapter!==undefined){
                    state.mycourse[findIndexCourse].chapters[findIndexChapter]=chapter
                    
                }
            }
        },
        addLessonToChapterFail:(state)=>{
            state.loading = false
            state.error = true
        },
        updateLessonSuccess:(state,action:PayloadAction<UpdateLessonSlices>)=>{
            state.loading = false
            state.error = true
            const {idcourse,idchapter,idlesson,name} = action.payload
            const findIndexCourse = state.mycourse?.findIndex(course=>course._id===idcourse)
            if(findIndexCourse!==undefined && state.mycourse){
                const findIndexChapter = state.mycourse[findIndexCourse].chapters.findIndex(chapter=>chapter._id===idchapter)
                if(findIndexChapter!==undefined){
                    const finIndexLesson = state.mycourse[findIndexCourse].chapters[findIndexChapter].lessons.findIndex(lesson=>lesson._id===idlesson)
                    if(finIndexLesson!==undefined){
                        state.mycourse[findIndexCourse].chapters[findIndexChapter].lessons[finIndexLesson].name = name
                    }
                }
            }
        },
        updateLessonFail:(state)=>{
            state.loading = false
            state.error = true
        },
        addContentSuccess:(state,action:PayloadAction<AddContentSlices>)=>{
            state.loading = false
            state.error = false
            const {idcourse,idchapter,idlesson,lesson} = action.payload
            const findIndexCourse = state.mycourse?.findIndex(course=>course._id===idcourse)
            if(findIndexCourse!==undefined && state.mycourse){
                const findIndexChapter = state.mycourse[findIndexCourse].chapters.findIndex(chapter=>chapter._id===idchapter)
                if(findIndexChapter!==undefined){
                    const finIndexLesson = state.mycourse[findIndexCourse].chapters[findIndexChapter].lessons.findIndex(lesson=>lesson._id===idlesson)
                    if(finIndexLesson!==undefined){
                        state.mycourse[findIndexCourse].chapters[findIndexChapter].lessons[finIndexLesson] = lesson
                    }
                }
            }
        },
        addContentFail:(state)=>{
            state.loading = false
            state.error = true
        },
        resetCourse:(state)=>{
            state.loading = false
            state.error = false
            state.mycourse = null
        }
    }
})

export const {
    startLoading,
    fetchMyCourseFail,
    fetchMyCourseSuccess,
    deleteMyCourseFail,
    deleteMyCourseSuccess,
    updateMyCourseFail,
    updateMyCourseSuccess,
    addLessonToChapterFail,
    addLessonToChapterSuccess,
    updateLessonSuccess,
    updateLessonFail,
    addContentFail,
    addContentSuccess,
    resetCourse
 } = courseSlice.actions

const {reducer:courseReducer} = courseSlice
export default courseReducer