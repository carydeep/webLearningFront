import { FastField, Form, Formik } from "formik"
import React, { ReactElement, useEffect, useState } from "react"
import { Container, Toast, ToastContainer } from "react-bootstrap"
import * as Yup from "yup"
import { useRouter } from "next/router"
import InputField from "../components/CustomFields/InputField"
import SearchLayout from "../components/Layouts/searchLayout"
import styles from "../styles/login.module.css"
import Lottie from "react-lottie"
import { motion } from "framer-motion"
import Link from "next/link"
import Head from "next/head"
import authApi from "./api/authApi"
import { useDispatch } from "react-redux"
import { loginFail, loginStart, loginSuccess } from "../redux/slices/authSlice"
import { useAppSelector } from "../redux/hooks"
import { loginOptions } from "../lotties"
import { appear, appearAndmoveUp } from "../animation"

function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useAppSelector((state) => state.authReducer.currentUser)
  const [show, setShow] = useState<boolean>(false)
  useEffect(() => {
    user && router.push("/")
  }, [user])
  const initialValues = {
    username: "",
    password: "",
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("This field is required"),
    password: Yup.string().required("This field is required"),
  })

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
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async ({ username, password }) => {
                try {
                  dispatch(loginStart())
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
              }}
            >
              {(formikProps) => {
                return (
                  <Form>
                    <motion.div
                      variants={appearAndmoveUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 1, type: "spring" }}
                    >
                      <FastField
                        name="username"
                        component={InputField}
                        type="text"
                        label="Tên đăng nhập"
                        placeholder="username..."
                      />
                    </motion.div>
                    <motion.div
                      variants={appearAndmoveUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 1.2, type: "spring" }}
                    >
                      <FastField
                        name="password"
                        component={InputField}
                        type="password"
                        label="Mật khẩu"
                        placeholder="password..."
                      />
                      <p className={styles.text}>
                        Chưa có tài khoản?{" "}
                        <Link href="/register">
                          <a className={styles.link}>Đăng ký</a>
                        </Link>
                      </p>
                    </motion.div>
                    <motion.button
                      type="submit"
                      className={styles.button}
                      variants={appearAndmoveUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 1.4, type: "spring" }}
                    >
                      Đăng nhập
                    </motion.button>
                  </Form>
                )
              }}
            </Formik>
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
