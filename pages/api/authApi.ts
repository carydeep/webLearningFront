import { RegisterUser } from "../../models/user"
import axiosClient from "./axiosClient"
import axiosUser from "./axiosUser"

const authApi = {
    refreshToken:()=>{
        const url = `/v1/auth/refreshToken`
        return axiosClient.post(url)
    },
    login:(username:string,password:string)=>{
        const url = `/v1/auth/login`
        const body = {
            username,
            password
        }
        return axiosClient.post(url,body)
    },
    logout:()=>{
        const url = `/v1/auth/logout`
        return axiosUser.post(url)
    },
    register:(body:RegisterUser)=>{
        const url = `/v1/auth/register`
        return axiosClient.post(url,body)
    }
}

export default authApi