import React, { ReactElement, useEffect, useState } from "react"
import { Card } from "react-bootstrap"
import HomeLayout from "../../../components/Layouts/homeLayout"
import styles from "../../../styles/MyCourse.module.css"
import Link from "next/link"
import Head from "next/head"
import { ChevronDoubleRight, PlusCircle } from "react-bootstrap-icons"
import { motion } from "framer-motion"
import { appearAndmoveDown } from "../../../animation"
import courseApi from "../../api/courseApi"
import { Course } from "../../../models/course"
import {
  deleteMyCourseFail,
  deleteMyCourseSuccess,
  fetchMyCourseFail,
  fetchMyCourseSuccess,
  startLoading,
} from "../../../redux/slices/courseSlice"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { useRouter } from "next/router"
import withAuth from "../../../components/HOC/withAuth"

function MyCourse() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.authReducer.currentUser)
  const courses = useAppSelector((state) => state.courseReducer.mycourse)
  const [rerender, setRerender] = useState<boolean>(true)
  useEffect(() => {
    !user && router.push("/")
    const fetchCourse = async () => {
      try {
        dispatch(startLoading())
        const res = await courseApi.getMyCourse()
        dispatch(fetchMyCourseSuccess(res.data))
      } catch (error) {
        dispatch(fetchMyCourseFail())
      }
    }
    fetchCourse()
  }, [])
  const handleDeleteCourse = async (_id: string) => {
    try {
      dispatch(startLoading())
      const res = await courseApi.deleteCourse(_id)
      dispatch(deleteMyCourseSuccess(res.data))
    } catch (error) {
      dispatch(deleteMyCourseFail())
    }
  }
  return (
    <>
      <Head>
        <title>Khóa học của tôi</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.14.0/devicon.min.css"
        ></link>
      </Head>
      <div className={`container ${styles.wrapper}`}>
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
        </div>
        <div className="d-flex flex-wrap">
          <motion.div
            variants={appearAndmoveDown}
            initial="hidden"
            animate="visible"
            transition={{ type: "spring", delay: 0.4 }}
          >
            <Card className={styles.card}>
              <Card.Body className={styles.card_body}>
                <Card.Text>
                  <PlusCircle className={styles.card_icon} />
                </Card.Text>
                <Card.Title className="mb-4">Thêm mới khóa học</Card.Title>
                <Card.Text className="d-flex justify-content-around">
                  <Link href={`/user/mycourse/addcourse`}>
                    <a className={styles.card_button}>Thêm</a>
                  </Link>
                </Card.Text>
              </Card.Body>
            </Card>
          </motion.div>
          {courses?.map((course: Course, index: any) => {
            return (
              <motion.div
                key={course._id}
                variants={appearAndmoveDown}
                initial="hidden"
                animate="visible"
                transition={{ type: "spring", delay: (index + 2) * 0.2 }}
              >
                <Card className={styles.card}>
                  <Card.Body className={styles.card_body}>
                    <Card.Text>
                      <i
                        className={`${styles.card_icon} ${course.icon} colored`}
                      />
                    </Card.Text>
                    <Card.Title className="mb-4">
                      {course.name.toUpperCase()}
                    </Card.Title>
                    <Card.Text className="d-flex justify-content-around">
                      <Link href={`/user/mycourse/${course.slug}`}>
                        <a className={styles.card_button}>Chỉnh sửa</a>
                      </Link>
                      <button
                        className={styles.card_button}
                        onClick={() => handleDeleteCourse(course._id)}
                      >
                        Xóa
                      </button>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default withAuth(MyCourse)

MyCourse.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>
}
