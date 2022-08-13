import { AddContentApi, AddLessonApi, updateContentApi } from "../../models/lesson"
import axiosClient from "./axiosClient"
import axiosUser from "./axiosUser"

const lessonApi = {
    addLesson:(idcourse:string,idchapter:string,data:AddLessonApi)=>{
        const url = `/api/course/mycourse/${idcourse}/chapter/${idchapter}/lesson/post`
        return axiosUser.post(url,data)
    },
    updateLesson:(idcourse:string,idchapter:string,idlesson:string,data:AddLessonApi)=>{
        const url = `/api/course/mycourse/${idcourse}/chapter/${idchapter}/lesson/${idlesson}`
        return axiosUser.patch(url,data)
    },
    deleteLesson:(idcourse:string,idchapter:string,idlesson:string)=>{
        const url = `/api/course/mycourse/${idcourse}/chapter/${idchapter}/lesson/${idlesson}`
        return axiosUser.delete(url)
    },
    addContent:(idcourse:string,idchapter:string,idlesson:string,data:AddContentApi)=>{
        const url = `/api/course/mycourse/${idcourse}/chapter/${idchapter}/lesson/${idlesson}/content/post`
        return axiosUser.post(url,data)
    },
    deleteContent:(idcourse:string,idchapter:string,idlesson:string,idcontent:string)=>{
        const url = `/api/course/mycourse/${idcourse}/chapter/${idchapter}/lesson/${idlesson}/content/${idcontent}`
        return axiosUser.delete(url)
    },
    getContent:(slugcourse:string,idchapter:string,idlesson:string)=>{
        const url = `/api/course/${slugcourse}/chapter/${idchapter}/lesson/${idlesson}/content/`
        return axiosClient.get(url)
    },
    getContentById:(idcourse:string,idchapter:string,idlesson:string,idcontent:string)=>{
        const url = `/api/course/mycourse/${idcourse}/chapter/${idchapter}/lesson/${idlesson}/content/${idcontent}`
        return axiosUser.get(url)
    },
    updateContentById:(idcourse:string,idchapter:string,idlesson:string,idcontent:string,data:updateContentApi)=>{
        const url = `/api/course/mycourse/${idcourse}/chapter/${idchapter}/lesson/${idlesson}/content/${idcontent}`
        return axiosUser.patch(url,data)
    }
}

export default lessonApi