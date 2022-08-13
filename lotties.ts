import LoginImage from "./public/LoginColored.json"
import Blogging from "./public/Blogging.json"
import Quizz from "./public/Quizz.json"
import LoginColored from "./public/LoginColored.json";
import RegisterImage from "./public/Register.json";
import UserImage from "./public/User.json";

const generateImage = (image:Object)=>{
    return {
        loop: true,
        autoplay: true,
        animationData: image,
        rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        },
    }
}

export const bloggingOptions = generateImage(Blogging)
export const quizzOptions = generateImage(Quizz)
export const loginOptions = generateImage(LoginColored)
export const registerOptions = generateImage(RegisterImage)
export const userOptions = generateImage(UserImage)