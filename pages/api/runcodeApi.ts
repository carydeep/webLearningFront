import axiosRuncodeCompiler from "./axiosCodeCompiler"

const runcodeApi = {
    run:(code:string,language:string)=>{
        const data = {
            code,
            language,
            input:""
        }
        const url = "/"
        return axiosRuncodeCompiler.post(url,data)
    },
    getLanguage:()=>{
        const url = "/list"
        return axiosRuncodeCompiler.get(url)
    }
}

export default runcodeApi