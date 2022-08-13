import { AddQuestionApi, CreateExcerciseApi } from "../../models/exercise"
import axiosClient from "./axiosClient"
import axiosUser from "./axiosUser"

const exerciseApi = {
    getExercise:()=>{
        const url = `/api/exercise/`
        return axiosClient.get(url)
    },
    getExerciseByID:(idexercise:string)=>{
        const url = `/api/exercise/${idexercise}`
        return axiosClient.get(url)
    },
    getMyExcercise:()=>{
        const url = `/api/exercise/myexercise`
        return axiosUser.get(url)
    },
    createExcercise:(data:CreateExcerciseApi)=>{   
        const url = `/api/exercise/myexercise/post`
        return axiosUser.post(url,data)
    },
    updateExercise:(idexercise:string,data:CreateExcerciseApi)=>{
        const url = `/api/exercise/myexercise/${idexercise}`
        return axiosUser.patch(url,data)
    },
    deleteExercise:(idexercise:string)=>{
        const url = `/api/exercise/myexercise/${idexercise}`
        return axiosUser.delete(url)
    },
    publicExercise:(idexercise:string)=>{
        const url = `/api/exercise/myexercise/${idexercise}/public`
        return axiosUser.post(url)
    },
    privateExercise:(idexercise:string)=>{
        const url = `/api/exercise/myexercise/${idexercise}/private`
        return axiosUser.post(url)
    },
    addQuestion:(idexercise:string,data:AddQuestionApi)=>{
        const url = `/api/exercise/myexercise/${idexercise}/postquestion`
        return axiosUser.post(url,data)
    },
    deleteQuestion:(idexercise:string,idquestion:string)=>{
        const url=`/api/exercise/myexercise/${idexercise}/question/${idquestion}`
        return axiosUser.delete(url)
    },
    updateQuestion:(idexercise:string,idquestion:string,data:AddQuestionApi)=>{
        const url=`/api/exercise/myexercise/${idexercise}/question/${idquestion}`
        return axiosUser.patch(url,data)
    }
}

export default exerciseApi