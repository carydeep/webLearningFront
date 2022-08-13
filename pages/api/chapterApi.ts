import { AddChapter } from "../../models/chapter"
import axiosUser from "./axiosUser"

const chapterApi = {
    addChapter:(idcourse:string,data:AddChapter)=>{
        const url = `/api/course/mycourse/${idcourse}/chapter/post`
        return axiosUser.post(url,data)
    },
    updateChapter:(idcourse:string,idchapter:string,data:AddChapter)=>{
        const url = `/api/course/mycourse/${idcourse}/chapter/${idchapter}`
        return axiosUser.patch(url,data)
    },
    deleteChapter:(idcourse:string,idchapter:string)=>{
        const url = `/api/course/mycourse/${idcourse}/chapter/${idchapter}`
        return axiosUser.delete(url)
    },
    publicCourse:(idcourse:string)=>{
        const url=`/api/course/mycourse/${idcourse}/public`
        return axiosUser.post(url)
    },
    privateCourse:(idcourse:string)=>{
        const url=`/api/course/mycourse/${idcourse}/private`
        return axiosUser.post(url)
    }
}

export default chapterApi