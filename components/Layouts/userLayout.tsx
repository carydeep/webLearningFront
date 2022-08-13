import React, { ReactElement, useEffect } from "react"
import styles from "../../styles/UserLayout.module.css"
import { motion } from "framer-motion"
import { useAppSelector } from "../../redux/hooks"
import { appearAndmoveDown } from "../../animation"
import { useDispatch } from "react-redux"
import { logoutSuccess } from "../../redux/slices/authSlice"
import authApi from "../../pages/api/authApi"
import { useRouter } from "next/router"
import { resetCourse } from "../../redux/slices/courseSlice"
import { resetExercise } from "../../redux/slices/exerciseSlice"

function UserLayout({ children }: { children: ReactElement }) {
  const router = useRouter()
  const user = useAppSelector((state) => state.authReducer.currentUser)
  const dispatch = useDispatch()
  useEffect(() => {
    !user && router.push("/")
  }, [user])

  const handleLogout = async () => {
    await authApi.logout()
    dispatch(logoutSuccess())
    dispatch(resetCourse())
    dispatch(resetExercise())
    router.push("/")
  }

  return (
    <div className="container">
      <motion.div
        className={styles.profile}
        variants={appearAndmoveDown}
        initial="hidden"
        animate="visible"
        transition={{ type: "spring", delay: 0.2 }}
      >
        <div>
          <h1>{`${user?.firstname} ${user?.lastname}`}</h1>
          <p>{user?.email}</p>
        </div>
        <div>
          <button
            onClick={() => handleLogout()}
            className={styles.profile_button}
          >
            Đăng xuất
          </button>
        </div>
      </motion.div>
      <div className="row mt-4 justify-content-center">{children}</div>
    </div>
  )
}

export default UserLayout
