import { FastField, Form, Formik } from "formik"
import * as Yup from "yup"
import { motion } from "framer-motion"
import { appearAndmoveUp } from "../../../animation"
import InputField from "../../CustomFields/InputField"
import styles from "../../../styles/login.module.css"

export interface FormRegisterValue {
  firstname: string
  lastname: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface SubmitRegisterForm {
  onSubmit: (formValue: FormRegisterValue) => void
}

function RegisterForm(props: SubmitRegisterForm) {
  const { onSubmit } = props
  const initialValues = {
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("This field is required"),
    lastname: Yup.string().required("This field is required"),
    username: Yup.string().required("This field is required"),
    email: Yup.string()
      .email("This field must be valid email")
      .required("This field must be required"),
    password: Yup.string()
      .required("This field must be required")
      .min(8, "Password too short")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
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
        )
      }}
    </Formik>
  )
}

export default RegisterForm
