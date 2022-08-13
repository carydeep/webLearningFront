import axiosClient from "./axiosClient"
import axiosUser from "./axiosUser"
interface ChangeProfile{
    firstname?:string,
    lastname?:string,
}

const userApi = {
    changePassword:(oldPassword:string,newPassword:string)=>{
        const url=`/v1/user/changepassword`
        return axiosUser.patch(url,{oldPassword,newPassword})
    },
    changeProfile:(data:ChangeProfile)=>{
        const url = `/v1/user/changeprofile`
        return axiosUser.patch(url,data)
    },
    getAllUser:()=>{
        const url = `/v1/user/`
        return axiosClient.get(url)
    }
}

export default userApi