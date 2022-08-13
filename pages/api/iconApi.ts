import axiosClient from "./axiosClient"

const iconApi = {
    getIcon:()=>{
        const url = `/api/icon/`
        return axiosClient.get(url)
    }
}

export default iconApi