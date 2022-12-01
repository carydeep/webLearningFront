import React, { useEffect, useState } from "react"
import HomeLayout from "../../../components/Layouts/homeLayout"
import Image from "next/image"
import ImageAddCourse from "../../../public/addcourse.png"
import * as Yup from "yup"
import { FastField, Form, Formik } from "formik"
import SelectField from "../../../components/CustomFields/SelectField"
import CheckBoxField from "../../../components/CustomFields/CheckBoxField"
import InputField from "../../../components/CustomFields/InputField"
import styles from "../../../styles/AddCourse.module.css"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import { ChevronDoubleRight } from "react-bootstrap-icons"
import iconApi from "../../api/iconApi"
import { Icon } from "../../../models/icon"
import groupApi from "../../api/groupApi"
import { Group } from "../../../models/group"
import topicApi from "../../api/topicApi"
import courseApi from "../../api/courseApi"
import { Toast, ToastContainer } from "react-bootstrap"
import { ToastError } from "../../../models/error"
import withAuth from "../../../components/HOC/withAuth"

function AddCourse() {
  const router = useRouter()
  const [groups, setGroups] = useState<Array<Group>>()
  const [topics, setTopics] = useState<Array<any>>()
  const [icons, setIcons] = useState<Array<Icon>>()
  const [show, setShow] = useState<ToastError>({
    show: false,
    message: "",
  })
  const toggleShow = () =>
    setShow({
      show: false,
      message: "",
    })
  useEffect(() => {
    const fetchData = async () => {
      const resIcons = await iconApi.getIcon()
      setIcons(resIcons.data)
      const resGroups = await groupApi.getGroup()
      setGroups(resGroups.data)
      const resTopics = await topicApi.getTopic()
      setTopics(resTopics.data)
    }
    fetchData()
  }, [])

  const inititalValues = {
    group: "",
    topics: [] as Array<string>,
    icon: "",
    name: "",
  }
  const validationSchema = Yup.object().shape({
    group: Yup.string().required("This field is required"),
    topics: Yup.array().min(1, "Need as least one"),
    icon: Yup.string().required("This field is required"),
    name: Yup.string().required("This field is required"),
  })

  return (
    <>
      <Head>
        <title>Thêm khóa học</title>
      </Head>
      <HomeLayout>
        <div className="container">
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
              <Toast.Body>{show.message}</Toast.Body>
            </Toast>
          </ToastContainer>
          <div className="d-flex align-items-center">
            <Link href="/user">
              <a className="text-reset text-decoration-none">
                <h4 className={styles.text}>Bảng điều khiển</h4>
              </a>
            </Link>
            <ChevronDoubleRight className={styles.text_icon} />
            <Link href="/user/mycourse">
              <a className="text-reset text-decoration-none">
                <h4 className={styles.text}>Các khóa học của tôi</h4>
              </a>
            </Link>
            <ChevronDoubleRight className={styles.text_icon} />
            <Link href="/user/mycourse/addcourse">
              <a className="text-reset text-decoration-none">
                <h4 className={styles.text}>Thêm khóa học</h4>
              </a>
            </Link>
          </div>
          <div className="row align-items-center">
            <div className="col-6">
              <Image src={ImageAddCourse} width={600} height={600} />
            </div>
            <div className="col-6">
              <Formik
                initialValues={inititalValues}
                validationSchema={validationSchema}
                onSubmit={async (value) => {
                  try {
                    await courseApi.addCourse(value)
                    router.push("/user/mycourse")
                  } catch (error: any) {
                    setShow({
                      show: true,
                      message: error?.response?.data || "",
                    })
                  }
                }}
              >
                {(formikProps) => {
                  return (
                    <Form>
                      {groups && (
                        <FastField
                          name="group"
                          component={SelectField}
                          label="Chọn nhóm khóa học"
                          options={groups}
                          labelOptions="Chọn một nhóm"
                        />
                      )}
                      {topics && (
                        <FastField
                          name="topics"
                          component={CheckBoxField}
                          label="Chọn các chủ đề"
                          options={topics}
                        />
                      )}
                      {icons && (
                        <FastField
                          name="icon"
                          component={SelectField}
                          label="Chọn icon cho khóa học"
                          options={icons}
                          labelOptions="Chọn một icon"
                        />
                      )}
                      <FastField
                        name="name"
                        component={InputField}
                        label="Tên khóa học"
                        type="text"
                        placeholder="Nhập khóa học..."
                      />
                      <button
                        className={`${styles.button_group} mt-4`}
                        type="submit"
                      >
                        Thêm khóa học
                      </button>
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  )
}

export default withAuth(AddCourse)
