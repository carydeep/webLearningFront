import { FastField, Form, Formik } from "formik"
import { useRouter } from "next/router"
import React, {
  BaseSyntheticEvent,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react"
import HomeLayout from "../../../../components/Layouts/homeLayout"
import * as Yup from "yup"
import InputField from "../../../../components/CustomFields/InputField"
import SelectField from "../../../../components/CustomFields/SelectField"
import CheckBoxField from "../../../../components/CustomFields/CheckBoxField"
import Image from "next/image"
import EditCourseImage from "../../../../public/EditCourse.png"
import styles from "../../../../styles/EditCourse.module.css"
import {
  ChevronDoubleRight,
  Pencil,
  PlusSquare,
  Trash,
} from "react-bootstrap-icons"
import Link from "next/link"
import Head from "next/head"
import { OverlayTrigger, Toast, ToastContainer, Tooltip } from "react-bootstrap"
import iconApi from "../../../api/iconApi"
import groupApi from "../../../api/groupApi"
import topicApi from "../../../api/topicApi"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { UpdateCourse } from "../../../../models/course"
import { ToastError } from "../../../../models/error"
import {
  addLessonToChapterFail,
  addLessonToChapterSuccess,
  startLoading,
  updateLessonFail,
  updateLessonSuccess,
  updateMyCourseFail,
  updateMyCourseSuccess,
} from "../../../../redux/slices/courseSlice"
import courseApi from "../../../api/courseApi"
import chapterApi from "../../../api/chapterApi"
import lessonApi from "../../../api/lessonApi"
import { Lesson } from "../../../../models/lesson"

function EditCourse() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [groups, setGroups] = useState<Array<any>>([])
  const [topics, setTopics] = useState<Array<any>>([])
  const [icons, setIcons] = useState<Array<any>>([])
  const chapterContainer = useRef<HTMLInputElement>(null)
  const lessonContainer = useRef<Array<HTMLInputElement>>([])
  const thisCourse = useAppSelector((state) =>
    state.courseReducer.mycourse?.find(
      (c) => c.slug === router.query.editcourse
    )
  )
  const [showEditable, setShowEditTable] = useState<any>(null)
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

  useEffect(() => {
    thisCourse &&
      setInitialValues({
        group: thisCourse.group,
        topics: thisCourse.topics,
        icon: thisCourse.icon,
        name: thisCourse.name,
      })
  }, [thisCourse])

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

  const [initialValues, setInitialValues] = useState<UpdateCourse>({
    group: "",
    topics: [],
    icon: "",
    name: "",
  })
  const validationSchema = Yup.object().shape({
    group: Yup.string().required("This field is required"),
    topics: Yup.array().min(1, "Need as least one"),
    icon: Yup.string().required("This field is required"),
    name: Yup.string().required("This field is required"),
  })

  const handleAddChapter = () => {
    const { current } = chapterContainer
    if (current) {
      current.classList.toggle("displaynone")
      current.value = ""
      current.focus()
    }
  }
  const handleAddLesson = (index: number) => {
    const current = lessonContainer.current
    if (current && current[index]) {
      current[index].classList.toggle("displaynone")
      current[index].value = ""
      current[index].focus()
    }
  }
  const handleBlurAddChapter = async (e: BaseSyntheticEvent) => {
    const { current } = chapterContainer
    if (current) {
      if (e.target.value !== "" && thisCourse) {
        dispatch(startLoading())
        try {
          const updatedCourse = await chapterApi.addChapter(thisCourse._id, {
            name: e.target.value,
          })
          dispatch(updateMyCourseSuccess(updatedCourse.data))
          setShow({
            show: true,
            message: "Update Success",
            type: "success",
          })
        } catch (error: any) {
          dispatch(updateMyCourseFail())
          setShow({
            show: true,
            message: error?.response?.data || "",
            type: "danger",
          })
        }
      }
      current.classList.toggle("displaynone")
      current.value = ""
    }
  }
  const handleBlurAddLesson = async (
    e: BaseSyntheticEvent,
    idchapter: string,
    index: number
  ) => {
    const current = lessonContainer.current
    if (current && current[index]) {
      if (e.target.value !== "" && thisCourse) {
        dispatch(startLoading())
        try {
          const addLesson = await lessonApi.addLesson(
            thisCourse._id,
            idchapter,
            { name: e.target.value }
          )
          dispatch(
            addLessonToChapterSuccess({
              idchapter,
              chapter: addLesson.data,
              idcourse: thisCourse._id,
            })
          )
          setShow({
            show: true,
            message: "Add lesson success",
            type: "success",
          })
        } catch (error: any) {
          dispatch(updateMyCourseFail())
          setShow({
            show: true,
            message: error?.response?.data || "",
            type: "danger",
          })
        }
      }
      current[index].classList.toggle("displaynone")
      current[index].value = ""
    }
  }
  const handdleShowEdit = (id: any) => {
    setShowEditTable(id)
  }
  const handleUpdateChapter = async (
    e: BaseSyntheticEvent,
    idchapter: string,
    currentValue: string
  ) => {
    try {
      if (
        currentValue !== e.target.value &&
        e.target.value != "" &&
        thisCourse
      ) {
        dispatch(startLoading())
        const update = await chapterApi.updateChapter(
          thisCourse._id,
          idchapter,
          {
            name: e.target.value,
          }
        )
        dispatch(updateMyCourseSuccess(update.data))
        setShow({
          show: true,
          message: "Update chapter success",
          type: "success",
        })
      }
    } catch (error: any) {
      dispatch(updateMyCourseFail())
      setShow({
        show: true,
        message: error?.response?.data || "",
        type: "danger",
      })
    }
    setShowEditTable(null)
  }
  const handleUpdateLesson = async (
    idChapter: string,
    idLesson: string,
    e: BaseSyntheticEvent,
    currentValue: string
  ) => {
    try {
      if (
        currentValue !== e.target.value &&
        e.target.value != "" &&
        thisCourse
      ) {
        dispatch(startLoading())
        const updateLesson = await lessonApi.updateLesson(
          thisCourse._id,
          idChapter,
          idLesson,
          {
            name: e.target.value,
          }
        )
        dispatch(
          updateLessonSuccess({
            idcourse: thisCourse._id,
            idchapter: idChapter,
            idlesson: idLesson,
            name: updateLesson.data.name,
          })
        )
        setShow({
          show: true,
          message: "Update lesson success",
          type: "success",
        })
      }
      setShowEditTable(null)
    } catch (error: any) {
      dispatch(updateLessonFail())
      setShow({
        show: true,
        message: error?.response?.data || "",
        type: "danger",
      })
    }

    // const value = {
    //   name: e.target.value,
    //   chapter: idChapter,
    // };
    // await courseApi.updateLesson(value, idCourse, idChapter, idLesson, config);
    // const res = await courseApi.getMyCourseByID(courseId.slug, config);
    // setCourseId(res.data);
    // setShowEditTable(null);
  }
  const handleDeleteChapter = async (idChapter: string) => {
    if (thisCourse) {
      try {
        dispatch(startLoading())
        const updateCourse = await chapterApi.deleteChapter(
          thisCourse._id,
          idChapter
        )
        dispatch(updateMyCourseSuccess(updateCourse.data))
        setShow({
          show: true,
          message: "Delete Success",
          type: "success",
        })
      } catch (error: any) {
        dispatch(updateMyCourseFail())
        setShow({
          show: true,
          message: error?.response?.data || "",
          type: "danger",
        })
      }
    }
  }
  const handleDeleteLesson = async (idChapter: any, idLesson: any) => {
    try {
      dispatch(startLoading())
      if (thisCourse) {
        const updateChapter = await lessonApi.deleteLesson(
          thisCourse._id,
          idChapter,
          idLesson
        )
        dispatch(
          addLessonToChapterSuccess({
            chapter: updateChapter.data,
            idchapter: idChapter,
            idcourse: thisCourse._id,
          })
        )
      }
      setShow({
        show: true,
        message: "Delete lesson success",
        type: "success",
      })
    } catch (error: any) {
      dispatch(addLessonToChapterFail())
      setShow({
        show: true,
        message: error?.response?.data || "",
        type: "danger",
      })
    }
  }
  const publicCourse = async () => {
    try {
      if (thisCourse) {
        dispatch(startLoading())
        const res = await chapterApi.publicCourse(thisCourse._id)
        dispatch(updateMyCourseSuccess(res.data))
        setShow({
          show: true,
          message: "Public course success",
          type: "success",
        })
      }
    } catch (error: any) {
      dispatch(addLessonToChapterFail())
      setShow({
        show: true,
        message: error?.response?.data || "",
        type: "danger",
      })
    }
  }
  const privateCourse = async () => {
    try {
      if (thisCourse) {
        dispatch(startLoading())
        const res = await chapterApi.privateCourse(thisCourse._id)
        dispatch(updateMyCourseSuccess(res.data))
        setShow({
          show: true,
          message: "Private course success",
          type: "success",
        })
      }
    } catch (error: any) {
      dispatch(addLessonToChapterFail())
      setShow({
        show: true,
        message: error?.response?.data || "",
        type: "danger",
      })
    }
  }
  return (
    <HomeLayout>
      <Fragment>
        <Head>
          <title>Chỉnh sửa</title>
        </Head>
        <div className="container">
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
          <div className="d-flex align-items-center flex-wrap">
            <Link href="/user">
              <a className="text-reset text-decoration-none">
                <h4 className={styles.textLink}>Bảng điều khiển</h4>
              </a>
            </Link>
            <ChevronDoubleRight className={styles.text_icon} />
            <Link href="/user/mycourse">
              <a className="text-reset text-decoration-none">
                <h4 className={styles.textLink}>Các khóa học của tôi</h4>
              </a>
            </Link>
            <ChevronDoubleRight className={styles.text_icon} />
            <Link href={router.asPath}>
              <a className="text-reset text-decoration-none">
                <h4 className={styles.textLink}>Chỉnh sửa khóa học</h4>
              </a>
            </Link>
          </div>
          <div className="row align-items-center mb-5">
            <div className="col-6">
              <Image src={EditCourseImage} width={500} height={500} />
            </div>
            <div className="col-6">
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (value: UpdateCourse) => {
                  if (JSON.stringify(value) !== JSON.stringify(initialValues)) {
                    try {
                      dispatch(startLoading())
                      if (router.query.editcourse) {
                        const res = await courseApi.updateCourse(
                          router.query.editcourse as string,
                          value
                        )
                        dispatch(updateMyCourseSuccess(res.data))
                        setShow({
                          show: true,
                          message: "Update Success",
                          type: "success",
                        })
                      }
                    } catch (error: any) {
                      dispatch(updateMyCourseFail())
                      setShow({
                        show: true,
                        message: error?.response?.data || "",
                        type: "danger",
                      })
                    }
                  }
                }}
              >
                {(formikProps) => {
                  const { values } = formikProps
                  return (
                    <Form>
                      {groups.length !== 0 && (
                        <FastField
                          name="group"
                          component={SelectField}
                          label="Chọn nhóm khóa học"
                          options={groups}
                          labelOptions="Chọn một nhóm"
                        />
                      )}
                      {topics.length !== 0 && (
                        <FastField
                          name="topics"
                          component={CheckBoxField}
                          label="Chọn các chủ đề"
                          options={topics}
                        />
                      )}
                      {icons.length !== 0 && (
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
                        type="submit"
                        className={styles.button_addChapter}
                      >
                        Lưu
                      </button>
                      {thisCourse?.public ? (
                        <button
                          type="button"
                          className={`${styles.button_addChapter} ms-3`}
                          onClick={() => privateCourse()}
                        >
                          Private
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.button_addChapter} ms-3`}
                          onClick={() => publicCourse()}
                        >
                          Publish
                        </button>
                      )}
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
          {thisCourse && (
            <h1 className={styles.text}>
              Chương của khóa học {thisCourse.name}
            </h1>
          )}
          <div className={styles.text}>
            <div>
              {thisCourse &&
                thisCourse.chapters.map((chapter, index) => {
                  return (
                    <div key={chapter._id} className="d-block">
                      <div className={styles.chapter}>
                        {showEditable === chapter._id ? (
                          <input
                            type="text"
                            defaultValue={chapter.name}
                            onBlur={(e) =>
                              handleUpdateChapter(e, chapter._id, chapter.name)
                            }
                            autoFocus={true}
                            contentEditable
                            className={styles.chapter_input}
                          />
                        ) : (
                          <div className="d-flex align-self-center align-items-center">
                            <div>{chapter.name}</div>
                            <button
                              type="button"
                              onClick={() => handdleShowEdit(chapter._id)}
                              className={styles.chapter_button}
                            >
                              <Pencil />
                            </button>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteChapter(chapter._id)}
                          className={styles.chapter_button}
                        >
                          <Trash />
                        </button>
                      </div>
                      {chapter.lessons.map((lesson: Lesson) => {
                        return (
                          <div key={lesson._id} className={styles.lesson}>
                            {showEditable === lesson._id ? (
                              <input
                                type="text"
                                defaultValue={lesson.name}
                                onBlur={(e) =>
                                  handleUpdateLesson(
                                    chapter._id,
                                    lesson._id,
                                    e,
                                    lesson.name
                                  )
                                }
                                autoFocus={true}
                                contentEditable
                                className={styles.chapter_input}
                              />
                            ) : (
                              <div className="d-flex align-self-center align-items-center">
                                <div>{lesson.name}</div>
                                <button
                                  type="button"
                                  onClick={() => handdleShowEdit(lesson._id)}
                                  className={styles.chapter_button}
                                >
                                  <Pencil />
                                </button>
                              </div>
                            )}
                            <div>
                              <Link
                                href={`/user/mycourse/${thisCourse.slug}/addcontent?lessonid=${lesson._id}&chapterid=${chapter._id}`}
                              >
                                <a className={styles.chapter_button}>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={
                                      <Tooltip>Thêm nội dung bài học</Tooltip>
                                    }
                                  >
                                    <PlusSquare className="text-dark" />
                                  </OverlayTrigger>
                                </a>
                              </Link>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteLesson(chapter._id, lesson._id)
                                }
                                className={styles.chapter_button}
                              >
                                <Trash />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                      <input
                        ref={(e) => {
                          if (e) {
                            lessonContainer.current[index] = e
                          }
                        }}
                        type="text"
                        onBlur={(e) =>
                          handleBlurAddLesson(e, chapter._id, index)
                        }
                        placeholder="lesson..."
                        className={`${styles.chapter_input} displaynone`}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleAddLesson(index)}
                        className={styles.button}
                      >
                        Thêm bài học
                      </button>
                    </div>
                  )
                })}
            </div>
          </div>
          <input
            ref={chapterContainer}
            type="text"
            onBlur={(e) => handleBlurAddChapter(e)}
            placeholder="chapter..."
            className={`${styles.chapter_input} displaynone`}
            autoFocus
          />
          <button
            type="button"
            onClick={() => handleAddChapter()}
            className={styles.button_addChapter}
          >
            Add chapter
          </button>
        </div>
      </Fragment>
    </HomeLayout>
  )
}

export default EditCourse
