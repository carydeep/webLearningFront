import axiosClient from "./axiosClient"

const groupApi = {
    getGroup:()=>{
        const url = `/api/group/`
        return axiosClient.get(url)
    }
}

export default groupApi