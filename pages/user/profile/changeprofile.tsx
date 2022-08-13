import React, { ReactElement, useEffect, useState } from "react";
import HomeLayout from "../../../components/Layouts/homeLayout";
import ProfileLayout from "../../../components/Layouts/profileLayout";
import UserLayout from "../../../components/Layouts/userLayout";
import * as Yup from "yup";
import { FastField, Form, Formik } from "formik";
import InputField from "../../../components/CustomFields/InputField";
import { useRouter } from "next/router";
import styles from "../../../styles/ChangeProfile.module.css";
import { Toast, ToastContainer } from "react-bootstrap";
import Head from "next/head";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import userApi from "../../api/userApi";
import { ToastError } from "../../../models/error";
import { authSlice, changeProfile } from "../../../redux/slices/authSlice";

function ChangeProfile() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector(state=>state.authReducer.currentUser)
  const [show, setShow] = useState<ToastError>({
    show:false,
    message:''
  });
  const toggleShow = () => setShow({
    show:false,
    message:''
  });
  const initialValues = {
    firstname: user?.firstname||"",
    lastname: user?.lastname||"",
    email: user?.email||"",
    username: user?.username||"",
  }


  const validationSchema = Yup.object().shape({
    firstname: Yup.string(),
    lastname: Yup.string(),
    username: Yup.string().required("This field is required"),
    email: Yup.string()
      .email("This field must be valid email")
      .required("This field must be required"),
  });
  return (
    <>
      <Head>
        <title>Chỉnh sửa thông tin</title>
      </Head>
            <div className={styles.container}>
            <ToastContainer className="p-3" position="top-end">
                        <Toast
                            show={show.show}
                            onClose={toggleShow}
                            bg="danger"
                            delay={3000}
                            autohide
                        >
                            <Toast.Header>
                                <strong className="me-auto">Có lỗi nè</strong>
                            </Toast.Header>
                            <Toast.Body>
                                {show.message}
                            </Toast.Body>
                        </Toast>
                    </ToastContainer>
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  if(JSON.stringify(values)!==JSON.stringify(initialValues)){
                      try {
                        await userApi.changeProfile(values)
                        dispatch(changeProfile(values))
                        router.push('/user/profile')
                      } catch (error:any) {
                        console.log(error)
                        setShow({
                          show:true,
                          message:error?.respond?.data
                        })
                      }
                    }
                }}
              >
                {(formiksProps) => {
                  return (
                    <Form>
                      <FastField
                        name="firstname"
                        component={InputField}
                        type="text"
                        label="Tên"
                        placeholder="Nhập..."
                      />
                      <FastField
                        name="lastname"
                        component={InputField}
                        type="text"
                        label="Họ"
                        placeholder="Nhập..."
                      />
                      <FastField
                        name="email"
                        component={InputField}
                        type="text"
                        label="Email"
                        placeholder="Nhập..."
                        readonly={true}
                      />
                      <FastField
                        name="username"
                        component={InputField}
                        type="text"
                        label="Tên đăng nhập"
                        readonly={true}
                      />
                      <button type="submit" className={styles.button}>
                        Cập nhật thông tin
                      </button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
    </>
  );
}

export default ChangeProfile;

ChangeProfile.getLayout = function getLayout(page:ReactElement){
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