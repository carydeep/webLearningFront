import {
  ErrorMessage,
  FastField,
  Field,
  FieldArray,
  Form,
  Formik,
} from "formik"
import React, { useEffect, useState } from "react"
import { PlusSquare, Trash, XLg } from "react-bootstrap-icons"
import InputFieldQuiz from "../../../components/CustomFields/InputFieldQuizz"
import HomeLayout from "../../../components/Layouts/homeLayout"
import styles from "../../../styles/AddQuizz.module.css"
import AddQuizImage from "../../../public/AddQuiz.png"
import Image from "next/image"
import exerciseApi from "../../api/exerciseApi"
import { useRouter } from "next/router"
import * as Yup from "yup"
import { Toast, ToastContainer } from "react-bootstrap"
import Head from "next/head"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { ToastError } from "../../../models/error"
import {
  actionFail,
  addQuestion,
  deleteQuestion,
  startLoading,
  updateQuestion,
} from "../../../redux/slices/exerciseSlice"
import { AddQuestionApi, Question } from "../../../models/exercise"

function AddQuestion() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState<Question>()
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
  const dispatch = useAppDispatch()
  const questions = useAppSelector((state) =>
    state.exerciseReducer.exercise?.find((ex) => ex._id === router.query.id)
  )?.questions
  const [initialValues, setInitialValues] = useState<AddQuestionApi>({
    name: "",
    options: [
      {
        _id: "",
        statement: "",
        explain: "",
        isRight: false,
      },
    ],
  })
  const validateSchema = Yup.object().shape({
    name: Yup.string().required("Câu hỏi khum được để trống"),
    options: Yup.array()
      .min(2, "Phải có ít nhất 2 đáp án")
      .of(
        Yup.object().shape({
          statement: Yup.string().required("Đáp án khum được để trống"),
        })
      )
      .test("test", "Phải có ít nhất 1 đáp án đúng", (options: any) => {
        return options?.some((option: any) => option.isRight)
      }),
  })
  useEffect(() => {
    if (currentQuestion) {
      setInitialValues(currentQuestion)
    }
  }, [currentQuestion])
  const handleDeleteQuestion = async (id: any, event: any) => {
    event.stopPropagation()
    try {
      dispatch(startLoading())
      if (router.query.id) {
        const res = await exerciseApi.deleteQuestion(
          router.query.id as string,
          id
        )
        dispatch(deleteQuestion(res.data))
        setShow({
          show: true,
          message: "Delete question success",
          type: "success",
        })
      }
    } catch (error: any) {
      dispatch(actionFail())
      setShow({
        show: true,
        message: error?.response?.data || "",
        type: "danger",
      })
      console.log(error)
    }
  }
  const handleRenew = () => {
    setCurrentQuestion(undefined)
    setInitialValues({
      name: "",
      options: [
        {
          _id: "",
          statement: "",
          explain: "",
          isRight: false,
        },
      ],
    })
  }
  return (
    <HomeLayout>
      <div className="container" style={{ minHeight: "100vh" }}>
        <Head>
          <title>Thêm câu hỏi</title>
        </Head>
        <div className={styles.nav}>
          {questions &&
            questions.map((question, index) => {
              return (
                <div
                  key={question._id}
                  className={`${styles.navItem} ${
                    currentQuestion?._id == question._id && styles.active
                  }`}
                >
                  <div
                    className={styles.navLink}
                    onClick={() => setCurrentQuestion(question)}
                  >
                    <p className={styles.name}>{`Câu ${index + 1}`}</p>
                    <button
                      className={styles.button}
                      onClick={(e) => handleDeleteQuestion(question._id, e)}
                    >
                      <XLg />
                    </button>
                  </div>
                </div>
              )
            })}
          <div>
            <PlusSquare className={styles.navAdd} onClick={handleRenew} />
          </div>
        </div>
        <div className="row align-items-center position-relative">
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
          <div className="col">
            <div className="mt-3">
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validateSchema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    dispatch(startLoading())
                    if (router.query.id) {
                      if (currentQuestion) {
                        if (
                          JSON.stringify(initialValues) !==
                          JSON.stringify(values)
                        ) {
                          const res = await exerciseApi.updateQuestion(
                            router.query.id as string,
                            currentQuestion._id,
                            values
                          )
                          dispatch(updateQuestion(res.data))
                          setShow({
                            show: true,
                            message: "Update question success",
                            type: "success",
                          })
                          resetForm()
                          handleRenew()
                        }
                      } else {
                        const res = await exerciseApi.addQuestion(
                          router.query.id as string,
                          values
                        )
                        dispatch(addQuestion(res.data))
                        setShow({
                          show: true,
                          message: "Add question success",
                          type: "success",
                        })
                        resetForm()
                        handleRenew()
                      }
                    }
                  } catch (error: any) {
                    dispatch(actionFail())
                    setShow({
                      show: true,
                      message: error?.response?.data || "",
                      type: "danger",
                    })
                    console.log(error)
                  }
                }}
              >
                {({ values, errors }) => {
                  return (
                    <Form>
                      <FastField
                        name="name"
                        component={InputFieldQuiz}
                        type="text"
                        label="Câu hỏi"
                        placeholder="Thêm câu hỏi ở đây"
                      />
                      <FieldArray name="options">
                        {({ remove, push }) => (
                          <div>
                            {values.options?.map((option: any, index: any) => (
                              <div key={index} className={styles.options}>
                                <Field
                                  type="checkbox"
                                  name={`options.${index}.isRight`}
                                  className={styles.checkbox}
                                />
                                <div
                                  className={`${styles.option} ${
                                    option.isRight && styles.active
                                  }`}
                                >
                                  <p className={styles.optionName}>
                                    {String.fromCharCode(
                                      97 + index
                                    ).toUpperCase()}
                                  </p>
                                  <Trash
                                    className={styles.optionDelete}
                                    onClick={() => remove(index)}
                                  />
                                </div>
                                <div className="flex-fill">
                                  <div className={styles.text}>
                                    <label
                                      htmlFor={`options.${index}.statement`}
                                      className={styles.formLabel}
                                    >
                                      Lựa chọn
                                    </label>
                                    <div>
                                      <Field
                                        name={`options.${index}.statement`}
                                        placeholder="Thêm đáp án ở đây"
                                        type="text"
                                        className={styles.input}
                                      />
                                      <ErrorMessage
                                        name={`options.${index}.statement`}
                                        component="div"
                                        className={styles.errorMess}
                                      />
                                    </div>
                                  </div>
                                  <div className={styles.text}>
                                    <label
                                      htmlFor={`options.${index}.statement`}
                                      className={styles.formLabel}
                                    >
                                      Giải thích
                                    </label>
                                    <Field
                                      name={`options.${index}.explain`}
                                      placeholder="Giải thích đáp án ở đây"
                                      type="text"
                                      className={styles.input}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              className={styles.addOption}
                              onClick={() =>
                                push({
                                  statement: "",
                                  explain: "",
                                  isRight: false,
                                })
                              }
                            >
                              Thêm đáp án
                            </button>
                          </div>
                        )}
                      </FieldArray>
                      {typeof errors.options === "string" ? (
                        <ErrorMessage
                          name={`options`}
                          component="div"
                          className={styles.errorMess}
                        />
                      ) : null}
                      <div className={`d-flex justify-content-around mt-3`}>
                        <button className={`${styles.addOption}`} type="submit">
                          {currentQuestion ? "Lưu" : "Thêm câu hỏi"}
                        </button>
                      </div>
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
          <div className="col">
            <Image src={AddQuizImage} width={700} height={500} />
          </div>
        </div>
      </div>
    </HomeLayout>
  )
}

export default AddQuestion
