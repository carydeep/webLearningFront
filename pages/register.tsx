import { useRouter } from "next/router"
import { ReactElement, useState } from "react"
import { FastField, Form, Formik } from "formik"
import InputField from "../components/CustomFields/InputField"
import { Container, Toast, ToastContainer } from "react-bootstrap"
import * as Yup from "yup"
import styles from "../styles/login.module.css"
import SearchLayout from "../components/Layouts/searchLayout"
import { motion } from "framer-motion"
import Lottie from "react-lottie"
import { registerOptions } from "../lotties"
import { appear, appearAndmoveUp } from "../animation"
import authApi from "./api/authApi"
import { ToastError } from "../models/error"
import RegisterForm, {
  FormRegisterValue,
} from "../components/form/registerForm/RegisterForm"

const RegisterPage = () => {
  const router = useRouter()
  const [show, setShow] = useState<ToastError>({
    show: false,
    message: "",
  })
  const toggleShow = () =>
    setShow({
      show: false,
      message: "",
    })

  const handleonSubmit = async (values: FormRegisterValue) => {
    try {
      const { confirmPassword, ...newObject } = values
      await authApi.register(newObject)
      router.push("/login")
    } catch (error: any) {
      setShow({
        show: true,
        message: error?.response?.data || "",
      })
    }
  }

  return (
    <Container className={`${styles.section}`}>
      <ToastContainer className="position-fixed p-3" position="top-end">
        <Toast
          show={show.show}
          onClose={toggleShow}
          bg="danger"
          delay={2000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body>{show.message}</Toast.Body>
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
          <Lottie options={registerOptions} height={400} width={400}></Lottie>
        </motion.div>
        <div className="col col-md-6">
          <RegisterForm onSubmit={handleonSubmit}></RegisterForm>
        </div>
      </div>
    </Container>
  )
}

export default RegisterPage

RegisterPage.getLayout = function getLayout(page: ReactElement) {
  return <SearchLayout>{page}</SearchLayout>
}
