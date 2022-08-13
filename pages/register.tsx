import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { FastField, Form, Formik } from "formik";
import InputField from "../components/CustomFields/InputField";
import { Container, Toast, ToastContainer } from "react-bootstrap";
import * as Yup from "yup";
import styles from "../styles/login.module.css";
import SearchLayout from "../components/Layouts/searchLayout";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import { registerOptions } from "../lotties";
import { appear, appearAndmoveUp } from "../animation";
import authApi from "./api/authApi";
import { ToastError } from "../models/error";

const RegisterPage = () => {
  const router = useRouter();
  const [show, setShow] = useState<ToastError>({
    show:false,
    message:''
  });
  const toggleShow = () => setShow({
    show:false,
    message:''
  });
  const initialValues = {
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("This field is required"),
    lastname: Yup.string().required("This field is required"),
    username: Yup.string().required("This field is required"),
    email: Yup.string()
      .email("This field must be valid email")
      .required("This field must be required"),
    password: Yup.string()
      .required("This field must be required")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

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
            transition={{delay: 0.5,type: "spring"}}
          >
            <Lottie options={registerOptions} height={400} width={400}></Lottie>
          </motion.div>
          <div className="col col-md-6">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async ({ confirmPassword, ...newObject }) => {
                try {
                  await authApi.register(newObject)
                  router.push('/login')
                } catch (error:any) {
                  setShow({
                    show:true,
                    message:error?.response?.data || ''
                  })
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
                        name="firstname"
                        component={InputField}
                        type="text"
                        label="Tên"
                        placeholder="Tên"
                      ></FastField>
                      <FastField
                        name="lastname"
                        component={InputField}
                        type="text"
                        label="Họ"
                        placeholder="Họ"
                      ></FastField>
                      <FastField
                        name="username"
                        component={InputField}
                        type="text"
                        label="Tên đăng nhập"
                        placeholder="Tên đăng nhập"
                      ></FastField>
                      <FastField
                        name="email"
                        component={InputField}
                        type="email"
                        label="Email"
                        placeholder="Email"
                      ></FastField>
                      <FastField
                        name="password"
                        component={InputField}
                        type="password"
                        label="Mật khẩu"
                        placeholder="Mật khẩu"
                      ></FastField>
                      <FastField
                        name="confirmPassword"
                        component={InputField}
                        type="password"
                        label="Xác nhận mật khẩu"
                        placeholder="Xác nhận mật khẩu"
                      ></FastField>
                      <button type="submit" className={styles.button}>
                        Register
                      </button>
                    </motion.div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Container>
  );
};

export default RegisterPage;

RegisterPage.getLayout = function getLayout(page:ReactElement){
  return(
      <SearchLayout>
          {page}
      </SearchLayout>
  )
}