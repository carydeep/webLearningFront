import React, { useEffect, useState } from "react"
import HomeLayout from "../../../components/Layouts/homeLayout"
import styles from "../../../styles/Exercise.module.css"
import { FastField, Form, Formik } from "formik"
import InputField from "../../../components/CustomFields/InputField"
import CheckBoxField from "../../../components/CustomFields/CheckBoxField"
import {
  CloudArrowUp,
  Lock,
  NodePlus,
  Pencil,
  PlusSquare,
  QuestionSquare,
  Trash,
} from "react-bootstrap-icons"
import Link from "next/link"
import * as Yup from "yup"
import {
  Modal,
  Button,
  OverlayTrigger,
  Tooltip,
  Toast,
  ToastContainer,
} from "react-bootstrap"

import Head from "next/head"
import userApi from "../../api/userApi"
import { AllUser } from "../../../models/user"
import exerciseApi from "../../api/exerciseApi"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import {
  actionFail,
  createExercise,
  deleteExercise,
  getExercise,
  startLoading,
  updateExercise,
} from "../../../redux/slices/exerciseSlice"
import { ToastError } from "../../../models/error"
import { Exercise } from "../../../models/exercise"
import withAuth from "../../../components/HOC/withAuth"

function Question() {
  const handleShowEdit = () => setShowEdit(true)
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [users, setUsers] = useState<any>([])
  const [idEdit, setIdEdit] = useState<any>()
  const dispatch = useAppDispatch()
  const exercises = useAppSelector((state) => state.exerciseReducer.exercise)
  const [show, setShow] = useState<ToastError>({
    show: false,
    message: "",
    type: "success",
  })
  const toggleShow = () =>
    setShow({
      show: false,
      message: "",
    })

  const initialValues = {
    name: "",
    coCreator: [],
  }
  const [initialValueEdit, setInitialValueEdit] = useState<any>({
    name: "",
    coCreator: [],
  })

  const validateShema = Yup.object().shape({
    name: Yup.string().required("Bạn phải nhập tên"),
  })
  useEffect(() => {
    const fetchAllUser = async () => {
      const resUsers = await userApi.getAllUser()
      const filterUser = resUsers.data.map((user: AllUser) => {
        return {
          name: user.username,
          value: user._id,
        }
      })
      setUsers(filterUser)
    }
    fetchAllUser()
    const fetchMyExcercise = async () => {
      dispatch(startLoading())
      const resEx = await exerciseApi.getMyExcercise()
      dispatch(getExercise(resEx.data))
    }
    fetchMyExcercise()
  }, [])
  const handleEditExercise = (exercise: Exercise) => {
    setIdEdit(exercise._id)
    setInitialValueEdit({
      name: exercise.name,
      coCreator: exercise.coCreator.map((e: any) => e.toString()),
    })
    handleShowEdit()
  }
  const handledeleteExercise = async (exercise: Exercise) => {
    try {
      dispatch(startLoading())
      const deleteEx = await exerciseApi.deleteExercise(exercise._id)
      dispatch(deleteExercise(deleteEx.data))
    } catch (error: any) {
      dispatch(actionFail())
      setShow({
        show: true,
        message: error?.response?.data || "",
        type: "danger",
      })
    }
  }
  const handlePublishExercise = async (id: string) => {
    try {
      const res = await exerciseApi.publicExercise(id)
      dispatch(updateExercise(res.data))
      setShow({
        show: true,
        message: "Public exercise success",
        type: "success",
      })
    } catch (error: any) {
      console.log(error)
      dispatch(actionFail())
      setShow({
        show: true,
        message: error?.response?.data || "",
        type: "danger",
      })
    }
  }
  const handlePrivateExercise = async (id: string) => {
    try {
      const res = await exerciseApi.privateExercise(id)
      dispatch(updateExercise(res.data))
      setShow({
        show: true,
        message: "Private exercise success",
        type: "success",
      })
    } catch (error: any) {
      console.log(error)
      dispatch(actionFail())
      setShow({
        show: true,
        message: error?.response?.data || "",
        type: "danger",
      })
    }
  }
  return (
    <>
      <Head>
        <title>Bài tập</title>
      </Head>
      <HomeLayout>
        <div className={`container ${styles.wrapper}`}>
          <ToastContainer position="top-end" className="p-3 position-fixed">
            <Toast
              show={show.show}
              onClose={toggleShow}
              bg={show.type}
              delay={5000}
              autohide
            >
              <Toast.Header>
                <strong className="me-auto">
                  {show.type && show.type === "success"
                    ? "Thành công"
                    : "Có lỗi nè"}
                </strong>
              </Toast.Header>
              <Toast.Body>{show.message}</Toast.Body>
            </Toast>
          </ToastContainer>
          <Modal
            show={showEdit}
            onHide={() => setShowEdit(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header className="bg-success" closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Sửa câu hỏi
              </Modal.Title>
            </Modal.Header>
            <Formik
              enableReinitialize
              initialValues={initialValueEdit}
              validationSchema={validateShema}
              onSubmit={async (value) => {
                try {
                  dispatch(startLoading())
                  if (
                    JSON.stringify(initialValueEdit) !== JSON.stringify(value)
                  ) {
                    console.log(idEdit)
                    const updated = await exerciseApi.updateExercise(
                      idEdit,
                      value
                    )
                    dispatch(updateExercise(updated.data))
                    setShow({
                      show: true,
                      message: "Update exercise success",
                      type: "success",
                    })
                    setShowEdit(false)
                  }
                } catch (error: any) {
                  dispatch(actionFail())
                  setShow({
                    show: true,
                    message: error?.response?.data || "",
                    type: "danger",
                  })
                }
              }}
            >
              {(formikProps) => {
                return (
                  <Form>
                    <Modal.Body className="bg-secondary border-0">
                      <FastField
                        name="name"
                        component={InputField}
                        type="text"
                        label="Tên câu hỏi"
                        placeholder="Nhập..."
                      />
                      {users.length !== 0 && (
                        <FastField
                          name="coCreator"
                          component={CheckBoxField}
                          label="Chọn mấy thằng làm chung"
                          options={users}
                        />
                      )}
                    </Modal.Body>
                    <Modal.Footer className="bg-success border-0">
                      <Button
                        variant="secondary"
                        onClick={() => setShowEdit(false)}
                      >
                        Close
                      </Button>
                      <Button type="submit" variant="primary">
                        Lưu thay đổi
                      </Button>
                    </Modal.Footer>
                  </Form>
                )
              }}
            </Formik>
          </Modal>
          <div className="row">
            <div className="col">
              <h3 className={styles.title}>
                <NodePlus className={`${styles.iconTitle} ${styles.iconAdd}`} />
                Thêm mới bài tập
              </h3>
              <Formik
                initialValues={initialValues}
                validationSchema={validateShema}
                onSubmit={async (value, { resetForm }) => {
                  dispatch(startLoading())
                  const res = await exerciseApi.createExcercise(value)
                  dispatch(createExercise(res.data))
                  setShow({
                    show: true,
                    message: "Update Success",
                    type: "success",
                  })
                  resetForm()
                  try {
                  } catch (error: any) {
                    dispatch(actionFail())
                    setShow({
                      show: true,
                      message: error?.response?.data || "",
                      type: "danger",
                    })
                  }
                }}
              >
                {(formikProps) => {
                  return (
                    <Form>
                      <FastField
                        name="name"
                        component={InputField}
                        type="text"
                        label="Tên câu hỏi :"
                        placeholder="Nhập..."
                      />
                      {users.length !== 0 && (
                        <FastField
                          name="coCreator"
                          component={CheckBoxField}
                          label="Chọn mấy thằng làm chung :"
                          options={users}
                        />
                      )}
                      <button type="submit" className={styles.button}>
                        Thêm bài tập
                      </button>
                    </Form>
                  )
                }}
              </Formik>
            </div>
            <div className="col">
              <h3 className={styles.title}>
                <QuestionSquare
                  className={`${styles.iconTitle} ${styles.iconQuestion}`}
                />
                Bài tập của bạn
              </h3>
              <ul>
                {exercises &&
                  exercises.map((exercise) => {
                    return (
                      <li key={exercise._id} className={styles.question}>
                        <p className={styles.questionName}>{exercise.name}</p>
                        <div className={styles.questionModified}>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                {exercise.public
                                  ? "Private bài tập"
                                  : "Publish bài tập"}
                              </Tooltip>
                            }
                          >
                            {exercise.public ? (
                              <div
                                onClick={() =>
                                  handlePrivateExercise(exercise._id)
                                }
                              >
                                <Lock className={styles.questionModifiedIcon} />
                              </div>
                            ) : (
                              <div
                                onClick={() =>
                                  handlePublishExercise(exercise._id)
                                }
                              >
                                <CloudArrowUp
                                  className={styles.questionModifiedIcon}
                                />
                              </div>
                            )}
                          </OverlayTrigger>
                          <Link href={`/user/exercise/${exercise._id}/`}>
                            <a>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-top`}>
                                    Thêm câu hỏi
                                  </Tooltip>
                                }
                              >
                                <PlusSquare
                                  className={styles.questionModifiedIcon}
                                />
                              </OverlayTrigger>
                            </a>
                          </Link>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                Chỉnh sửa bài tập
                              </Tooltip>
                            }
                          >
                            <div onClick={() => handleEditExercise(exercise)}>
                              <Pencil className={styles.questionModifiedIcon} />
                            </div>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>Xóa bài tập</Tooltip>
                            }
                          >
                            <div onClick={() => handledeleteExercise(exercise)}>
                              <Trash className={styles.questionModifiedIcon} />
                            </div>
                          </OverlayTrigger>
                        </div>
                      </li>
                    )
                  })}
              </ul>
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  )
}

export default withAuth(Question)
