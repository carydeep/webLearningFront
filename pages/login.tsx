import React, { ReactElement, useEffect, useState } from "react"
import { Container, Toast, ToastContainer } from "react-bootstrap"
import { useRouter } from "next/router"
import SearchLayout from "../components/Layouts/searchLayout"
import styles from "../styles/login.module.css"
import Lottie from "react-lottie"
import { motion } from "framer-motion"
import Head from "next/head"
import authApi from "./api/authApi"
import { useDispatch } from "react-redux"
import { loginFail, loginStart, loginSuccess } from "../redux/slices/authSlice"
import { useAppSelector } from "../redux/hooks"
import { loginOptions } from "../lotties"
import { appear } from "../animation"
import LoginForm, {
  FormValueType,
} from "../components/form/loginForm/LoginForm"

function LoginPage() {
  const [show, setShow] = useState<boolean>(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useAppSelector((state) => state.authReducer.currentUser)

  useEffect(() => {
    user && router.push("/")
  }, [user])

  const handleOnSubmit = async (formValue: FormValueType) => {
    try {
      dispatch(loginStart())
      const { username, password } = formValue
      const res = await authApi.login(username, password)
      const { refreshToken, ...anothers } = res.data
      // localStorage.setItem("refreshToken", refreshToken)
      document.cookie = `refreshToken=${refreshToken};path=/;max-age=${
        60 * 60 * 24 * 365
      };`
      dispatch(loginSuccess(anothers))
      router.push("/")
    } catch (error) {
      dispatch(loginFail())
      setShow(true)
    }
  }

  return (
    <>
      <Head>
        <title>Đăng Nhập</title>
        <meta name="description" content="Register an account" />
      </Head>
      <Container className={styles.section}>
        <ToastContainer className="p-3" position="top-end">
          <Toast
            show={show}
            onClose={() => setShow(false)}
            bg="danger"
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Có lỗi nè</strong>
            </Toast.Header>
            <Toast.Body>
              Thông tin hoặc mật khẩu không đúng, đề nghị đồng chí thử lại
            </Toast.Body>
          </Toast>
        </ToastContainer>
        <div className="row align-items-center">
          <motion.div
            className="col col-md-6"
            variants={appear}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Lottie options={loginOptions} height={400} width={400}></Lottie>
          </motion.div>
          <div className="col col-md-6">
            <LoginForm onSubmit={handleOnSubmit} />
          </div>
        </div>
      </Container>
    </>
  )
}

export default LoginPage

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <SearchLayout>{page}</SearchLayout>
}
