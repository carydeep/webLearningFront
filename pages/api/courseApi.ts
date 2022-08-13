import { AddCourse, UpdateCourse } from "../../models/course"
import axiosClient from "./axiosClient"
import axiosUser from "./axiosUser"

const courseApi = {
    addCourse:(data:AddCourse)=>{
        const url = `/api/course/post`
        return axiosUser.post(url,data)
    },
    getMyCourse:()=>{
        const url = `/api/course/mycourse`
        return axiosUser.get(url)
    },
    deleteCourse:(_id:string)=>{
        const url = `/api/course/${_id}`
        return axiosUser.delete(url)
    },
    updateCourse:(slug:string,data:UpdateCourse)=>{
        const url = `/api/course/${slug}`
        return axiosUser.patch(url,data)
    },
    getCourse:()=>{
        const url = `/api/course/`
        return axiosClient.get(url)
    },
    getCourseBySlug:(slugcourse:string)=>{
        const url = `/api/course/${slugcourse}/`
        return axiosClient.get(url)
    },
    searchCourse:(url:string)=>{
        return axiosClient.get(url)
    }
}

export default courseApi