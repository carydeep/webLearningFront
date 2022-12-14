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
        <title>Th??m kh??a h???c</title>
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
                <strong className="me-auto">C?? l???i n??</strong>
              </Toast.Header>
              <Toast.Body>{show.message}</Toast.Body>
            </Toast>
          </ToastContainer>
          <div className="d-flex align-items-center">
            <Link href="/user">
              <a className="text-reset text-decoration-none">
                <h4 className={styles.text}>B???ng ??i???u khi???n</h4>
              </a>
            </Link>
            <ChevronDoubleRight className={styles.text_icon} />
            <Link href="/user/mycourse">
              <a className="text-reset text-decoration-none">
                <h4 className={styles.text}>C??c kh??a h???c c???a t??i</h4>
              </a>
            </Link>
            <ChevronDoubleRight className={styles.text_icon} />
            <Link href="/user/mycourse/addcourse">
              <a className="text-reset text-decoration-none">
                <h4 className={styles.text}>Th??m kh??a h???c</h4>
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
                          label="Ch???n nh??m kh??a h???c"
                          options={groups}
                          labelOptions="Ch???n m???t nh??m"
                        />
                      )}
                      {topics && (
                        <FastField
                          name="topics"
                          component={CheckBoxField}
                          label="Ch???n c??c ch??? ?????"
                          options={topics}
                        />
                      )}
                      {icons && (
                        <FastField
                          name="icon"
                          component={SelectField}
                          label="Ch???n icon cho kh??a h???c"
                          options={icons}
                          labelOptions="Ch???n m???t icon"
                        />
                      )}
                      <FastField
                        name="name"
                        component={InputField}
                        label="T??n kh??a h???c"
                        type="text"
                        placeholder="Nh???p kh??a h???c..."
                      />
                      <button
                        className={`${styles.button_group} mt-4`}
                        type="submit"
                      >
                        Th??m kh??a h???c
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
