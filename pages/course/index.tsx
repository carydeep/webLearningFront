import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import ContentChapter from "../../components/Courses/ContentChapter";
import HomeLayout from "../../components/Layouts/homeLayout";
import BarCourse from "../../components/Courses/BarCourse";
import HeaderCourse from "../../components/Courses/HeaderCourse";
import Head from "next/head";

function CoursePage() {
  const router = useRouter();
  // console.log(router.query)
//   const { CoursePage } = router.query;
//   const [title, setTitle] = useState<string>()
//   const [dataContent, setDataContent] = useState<Array<ContentList | null>>([
//     null,
//   ]);
//   const [url, setUrl] = useState<url | null>(null);
//   useEffect(() => {
//     setDataContent([null]);
//     const fetch = async () => {
//       const resTopic = await courseApi.getCourse(CoursePage)
//       setTitle(resTopic.data.name)
//     }
//     CoursePage && fetch()
//   }, [CoursePage]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await courseApi.getContentList(
//         url?.CoursePage,
//         url?.chapterID,
//         url?.lessonID
//       );
//       setDataContent(response.data);
//     };
//     if (url != null) {
//       fetchData();
//     }
//   }, [url]);

//   function handleClick(idChapter: number, idLesson: number | string) {
//     const indexUrl = {
//       CoursePage: `${CoursePage}`,
//       chapterID: idChapter,
//       lessonID: idLesson,
//     };
//     setUrl(indexUrl);
//   }

  return (
    <HomeLayout>
      <Fragment>
        <Head>
          <title>
            Khóa học
          </title>
        </Head>
        <div className="container" style={{ minHeight: "80vh" }}>
          <HeaderCourse current={CoursePage} />
          <div className="row mt-4">
            <div className="col-4 col-lg-2 col-md-3">
              <BarCourse courseName={CoursePage} current={null} />
            </div>
            <div className="col-8 col-lg-10 col-md-9">
              {/* {dataContent != null ? (
                <ContentChapter data={dataContent}></ContentChapter>
              ) : null} */}
            </div>
          </div>
        </div>
      </Fragment>
    </HomeLayout>
  );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const res = await fetch(`http://nginx/api/course/1/chapter/1/lesson/1/content/`)
//   const data = await res.json()
//   return {
//     props: {
//       data: data
//     }
//   }
// }

export default CoursePage;