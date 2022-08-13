import React, { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/router"
import courseApi from "../../api/courseApi"
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import ContentChapter from "../../../components/Courses/ContentChapter"
import HomeLayout from "../../../components/Layouts/homeLayout"
import BarCourse from "../../../components/Courses/BarCourse"
import HeaderCourse from "../../../components/Courses/HeaderCourse"
import Head from "next/head"
import { Course } from "../../../models/course"
import { Content } from "../../../models/lesson"
import lessonApi from "../../api/lessonApi"

interface url {
  courseID: number | string
  chapterID: number
  lessonID: number | string
}

function ChapterID() {
  const router = useRouter()
  const { courseID, lesson, chapter } = router.query
  const [dataContent, setDataContent] = useState<Array<Content>>()
  const [url, setUrl] = useState<url | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      const res = await lessonApi.getContent(
        courseID as string,
        chapter as string,
        lesson as string
      )
      setDataContent(res.data.content)
    }
    courseID && chapter && lesson && fetchContent()
  }, [router])
  return (
    <HomeLayout>
      <Fragment>
        <Head>
          <title>{`${courseID}`}</title>
        </Head>
        <div className="container" style={{ minHeight: "80vh" }}>
          <HeaderCourse current={courseID} />
          <div className="row mt-4">
            <div className="col-4 col-lg-2 col-md-3">
              <BarCourse courseName={courseID} current={lesson} />
            </div>
            <div className="col-8 col-lg-10 col-md-9">
              {dataContent && (
                <ContentChapter data={dataContent}></ContentChapter>
              )}
            </div>
          </div>
        </div>
      </Fragment>
    </HomeLayout>
  )
}

// export const getStaticPaths: GetStaticPaths = async () => {
//     const response = await fetch("http://localhost:6969/api/course/")
//     const data: Array<Course> = await response.json()
//     const paths = data.map((course: Course) => ({
//         params: {
//             courseID: course.slug,
//         },
//     }));
//     return {
//         paths,
//         fallback: false,
//     };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//     const response = await fetch(`http://localhost:6969/api/course/${params?.courseID}/`)
//     const course: Course = await response.json()
//     return {
//         props: {
//             course,
//         },
//     };
// };

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { courseID, chapter, lesson } = context.query
//   const res = await fetch(
//     `${process.env.URL_API}/api/course/${courseID}/chapter/${chapter}/lesson/${lesson}/content/`
//   )
//   const data = await res.json()
//   console.log(data)
//   return {
//     props: {
//       data: data,
//     },
//   }
// }

export default ChapterID
