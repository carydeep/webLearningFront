// api/axiosClient.js
import axios, { AxiosRequestConfig, Method } from 'axios';
import queryString from 'query-string';
import { useAppSelector } from '../../redux/hooks';
import jwtDecode from 'jwt-decode';
import authApi from './authApi';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess } from '../../redux/slices/authSlice';
import { persistor, store } from '../../redux/store';
import axiosClient from './axiosClient';
// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-config` for the full list of configs
interface DecodedToken{
    "id": string,
  "username": string,
  "password": string,
  "role": string,
  "iat": number,
  "exp": number
}

const axiosUser = axios.create({
    baseURL: process.env.URL_API,
    withCredentials:true,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});
const {dispatch} = store
axiosUser.interceptors.request.use(async (config: AxiosRequestConfig) => {
    // Handle token here ...
    // const dispatch = useDispatch()
    const user = store.getState().authReducer.currentUser
    function getCookie (name:string) {
        let value = `; ${document.cookie}`;
        let parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
    try {
        if (config.headers && user) {
            let date = new Date()
            let refreshTokenLocal
            const decodedToken:DecodedToken = jwtDecode(user.accessToken)
            if (typeof window !== 'undefined') {
                // refreshTokenLocal = localStorage.getItem('refreshToken')
                refreshTokenLocal = getCookie('refreshToken')
              }
            if(decodedToken.exp < date.getTime()/1000){
                const res = await authApi.refreshToken(refreshTokenLocal)
                const updateTokenUser = {
                    ...user,
                    accessToken:res.data.accessToken
                }
                // localStorage.setItem("refreshToken",res.data.refreshToken)
                document.cookie = `refreshToken=${res.data.refreshToken};path=/;max-age=${
                    60 * 60 * 24 * 364
                  };`
                dispatch(loginSuccess(updateTokenUser))
                config.headers = {
                    token : `Bearer ${res.data.accessToken}`
                }
            }else{
                config.headers = {
                    token : `Bearer ${user.accessToken}`
                }
            }
        }
        return config
    } catch (error) {
        return Promise.reject(error)
    }
})

axiosUser.interceptors.response.use((response) => {
    // if (response && response.data) {
    //     return response.data;
    // }
    return response
}, (error) => {
    // Handle errors
    throw error;
});
export default axiosUser;