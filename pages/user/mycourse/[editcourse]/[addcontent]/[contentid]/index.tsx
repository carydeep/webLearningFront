import { useRouter } from "next/router"
import React, { Fragment, useCallback, useEffect, useState } from "react"
import SearchLayout from "../../../../../../components/Layouts/searchLayout"
import styles from "../../../../../../styles/AddContent.module.css"
import AddText from "../../../../../../components/Content/AddText"
import AddPlayGround from "../../../../../../components/Content/AddPlayGround"
import Head from "next/head"
import Link from "next/link"
import { ChevronDoubleRight } from "react-bootstrap-icons"
import { useAppSelector } from "../../../../../../redux/hooks"
import withAuth from "../../../../../../components/HOC/withAuth"

function ContentEditPage() {
  const router = useRouter()
  const { editcourse, lessonid, chapterid, contentid } = router.query
  const [data, setData] = useState<any>()
  const [dataChange, setDataChange] = useState<any>()
  const content = useAppSelector((state) =>
    state.courseReducer.mycourse
      ?.find((course) => course.slug === editcourse)
      ?.chapters.find((chapter) => chapter._id === chapterid)
      ?.lessons.find((lesson) => lesson._id === lessonid)
      ?.content?.find((content) => content._id === contentid)
  )
  useEffect(() => {
    // const config = {
    //     headers: { Authorization: `Token ${localStorage.getItem("key")}` },
    // };
    // const fetch = async () => {
    //     // const res = await courseApi.getMyContentById(editcourse, chapterid, lessonid, contentid, config)
    //     setData(res.data)
    // }
    // editcourse && chapterid && lessonid && contentid && fetch()
  }, [editcourse, chapterid, lessonid, contentid])
  const handleChange = useCallback((valueChange: any) => {
    setDataChange(valueChange)
  }, [])
  const handleSubmit = () => {
    // const config = {
    //     headers: { Authorization: `Token ${localStorage.getItem("key")}` },
    // };
    // if (dataChange) {
    //     const { id, ...newObject } = dataChange
    //     const newData = {
    //         lesson: lessonid,
    //         title: 'test',
    //         content: newObject
    //     }
    //     courseApi.updateContent(newData, editcourse, chapterid, lessonid, contentid, config)
    //     router.push(`/user/mycourse/${editcourse}/ContentEditPage?chapterid=${chapterid}&lessonid=${lessonid}`)
    // }
  }
  const handleDelete = () => {
    // const config = {
    //     headers: { Authorization: `Token ${localStorage.getItem("key")}` },
    // };
    // courseApi.deleteContent(editcourse, chapterid, lessonid, contentid, config)
    // router.push(`/user/mycourse/${editcourse}/ContentEditPage?chapterid=${chapterid}&lessonid=${lessonid}`)
  }
  return (
    <SearchLayout>
      <Fragment>
        <Head>
          <title>Sửa nội dung | NháiW3school</title>
        </Head>
        <div className={`container ${styles.wrapper} mt-5`}>
          <div className="d-flex align-items-center mb-3 flex-wrap">
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
            <Link href="/user/mycourse">
              <a
                className="text-reset text-decoration-none"
                onClick={() => router.back()}
              >
                <h4 className={styles.text}>Sửa nội dung</h4>
              </a>
            </Link>
          </div>
          {content &&
            (content.type === "text" ? (
              <AddText value={content.value} />
            ) : (
              <AddPlayGround
                currentValue={content.value}
                currentButton={content.button}
                currentLanguage={content.language}
              />
            ))}
        </div>
      </Fragment>
    </SearchLayout>
  )
}

export default withAuth(ContentEditPage)
