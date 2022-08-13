import axiosClient from "./axiosClient"

const topicApi = {
    getTopic:()=>{
        const url = `/api/topic/`
        return axiosClient.get(url)
    }
}

export default topicApi