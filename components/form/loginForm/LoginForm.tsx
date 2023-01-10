import { FastField, Form, Formik } from "formik"
import * as Yup from "yup"
import { motion } from "framer-motion"
import InputField from "../../CustomFields/InputField"
import { appearAndmoveUp } from "../../../animation"
import styles from "../../../styles/login.module.css"
import Link from "next/link"

export interface FormValueType {
  username: string
  password: string
}

export interface SubmitFormProps {
  onSubmit: (formValue: FormValueType) => void
}

function LoginForm(props: SubmitFormProps) {
  const { onSubmit } = props
  const initialValues = {
    username: "",
    password: "",
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit(values)
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
  )
}

export default LoginForm
