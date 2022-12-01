import { useRouter } from "next/router"
import React, { ComponentType } from "react"
import LoginPage from "../../pages/login"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { logoutSuccess } from "../../redux/slices/authSlice"
import { resetCourse } from "../../redux/slices/courseSlice"
import { resetExercise } from "../../redux/slices/exerciseSlice"

function getCookie(name: string) {
  let value = `; ${document.cookie}`
  let parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
}

function withAuth<P>(Component: ComponentType<P>) {
  return (props: P) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.authReducer.currentUser)
    const refreshTokenLocal = getCookie("refreshToken")
    if (!refreshTokenLocal) {
      dispatch(logoutSuccess())
      dispatch(resetCourse())
      dispatch(resetExercise())
    }
    if (user) {
      return <Component {...props} user={user} />
    }
    router.push("/login")
    return null
  }
}

export default withAuth
