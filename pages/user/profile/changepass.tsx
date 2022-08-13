import { FastField, Form, Formik } from "formik";
import React, { ReactElement, useState } from "react";
import InputField from "../../../components/CustomFields/InputField";
import HomeLayout from "../../../components/Layouts/homeLayout";
import ProfileLayout from "../../../components/Layouts/profileLayout";
import UserLayout from "../../../components/Layouts/userLayout";
import * as Yup from "yup";
import styles from "../../../styles/ChangeProfile.module.css";
import { useRouter } from "next/router";
import { Toast, ToastContainer } from "react-bootstrap";
import Head from "next/head";
import userApi from "../../api/userApi";

function ChangePass() {
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPass: "",
  };
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("This field is required"),
    newPassword: Yup.string()
      .required("This field is required")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmPass: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Passwords must match"
    ),
  });
  return (
    <>
      <Head>
        <title>Đổi mật khẩu</title>
      </Head>
            <div className={styles.container}>
              <ToastContainer className="p-3" position="top-end">
                <Toast
                  show={show}
                  onClose={() => setShow(false)}
                  bg="danger"
                  delay={2000}
                  autohide
                >
                  <Toast.Header>
                    <strong className="me-auto">Error</strong>
                  </Toast.Header>
                  <Toast.Body>Your old password not true</Toast.Body>
                </Toast>
              </ToastContainer>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async ({ oldPassword,newPassword }) => {
                    if(oldPassword!==newPassword){
                      try {
                        await userApi.changePassword(oldPassword,newPassword)
                        router.push('/user/profile')
                      } catch (error:any) {
                        setShow(true)
                      }
                    }
                }}
              >
                {(formiksProps) => {
                  return (
                    <Form>
                      <FastField
                        name="oldPassword"
                        component={InputField}
                        type="password"
                        label="Nhập mật khẩu cũ"
                        placeholder="Nhập..."
                      />
                      <FastField
                        name="newPassword"
                        component={InputField}
                        type="password"
                        label="Nhập mật khẩu mới"
                        placeholder="Nhập..."
                      />
                      <FastField
                        name="confirmPass"
                        component={InputField}
                        type="password"
                        label="Xác nhận lại mật khẩu mới"
                        placeholder="Nhập..."
                      />
                      <button type="submit" className={styles.button}>
                        Đổi mật khẩu
                      </button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
    </>
  );
}

export default ChangePass;

ChangePass.getLayout = function getLayout(page:ReactElement){
    return(
    <HomeLayout>
        <UserLayout>
            <ProfileLayout>
                {page}
            </ProfileLayout>
        </UserLayout>
    </HomeLayout>
    )
}