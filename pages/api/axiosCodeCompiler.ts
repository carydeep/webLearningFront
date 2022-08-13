// api/axiosRuncodeCompiler.js
import axios from "axios";
import queryString from "query-string";
// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-config` for the full list of configs

const axiosRuncodeCompiler = axios.create({
  baseURL: "https://codex-api.herokuapp.com",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosRuncodeCompiler.interceptors.request.use(async (config) => {
  // Handle token here ...
  return config;
});
axiosRuncodeCompiler.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // response.config.data.endTime = new Date().valueOf()
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});
export default axiosRuncodeCompiler;