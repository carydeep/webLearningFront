import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { Fragment, useCallback, useEffect, useState } from "react"
import HomeLayout from "../../../../../components/Layouts/homeLayout"
import PHP from "../../../../../components/RunCode/PHP"
import courseApi from "../../../../api/courseApi"
import "suneditor/dist/css/suneditor.min.css"
import AddText from "../../../../../components/Content/AddText"
import AddPlayGround from "../../../../../components/Content/AddPlayGround"
import styles from "../../../../../styles/AddContent.module.css"
import {
  ChevronDoubleRight,
  PencilSquare,
  XSquareFill,
} from "react-bootstrap-icons"
import Link from "next/link"
import Head from "next/head"
import Python from "../../../../../components/RunCode/Python"
import Java from "../../../../../components/RunCode/Java"
import JavaScipt from "../../../../../components/RunCode/JavaScript"
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks"
import {
  addContentFail,
  addContentSuccess,
  startLoading,
} from "../../../../../redux/slices/courseSlice"
import lessonApi from "../../../../api/lessonApi"
import RunCode from "../../../../../components/RunCode/Runcode"
import withAuth from "../../../../../components/HOC/withAuth"

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
})

function AddContentPage() {
  const redirecRouter = useRouter()
  const router = useRouter().query
  const { editcourse, chapterid, lessonid } = router
  const dispatch = useAppDispatch()
  const thisCourse = useAppSelector((state) =>
    state.courseReducer.mycourse?.find((c) => c.slug === editcourse)
  )
  const content = useAppSelector(
    (state) =>
      state.courseReducer.mycourse
        ?.find((course) => course.slug === editcourse)
        ?.chapters.find((chapter) => chapter._id === chapterid)
        ?.lessons.find((lesson) => lesson._id === lessonid)?.content
  )
  const [oldData, setOldData] = useState<Array<any>>([])
  // const [showButtonAdd, setShowButtonAdd] = useState<string>('')
  // const [valueChange, setValueChange] = useState<any>()
  // useEffect(() => {
  //   // const thisChapter = thisCourse?.chapters.find(
  //   //   (chapter) => chapter._id === chapterid
  //   // )
  //   // const thisLesson = thisChapter?.lessons.find(
  //   //   (lesson) => lesson._id === lessonid
  //   // )
  //   // console.log(thisLesson)
  //   // editcourse && chapterid && lessonid && fetch()
  // }, [editcourse, chapterid, lessonid])
  // useEffect(() => {
  //     if (valueChange) {
  //         const newData = [...data]
  //         newData[valueChange.id] = valueChange
  //         setData(newData)
  //     }
  // }, [valueChange])
  // console.log(valueSubmit)
  // const fetch = async () => {
  //     const res = await courseApi.getMyContent(editcourse, chapterid, lessonid, { headers: { Authorization: `Token ${localStorage.getItem("key")}` } })
  //     const contentData = res.data.map(({ id, content }: { id: any, content: any }) => {
  //         return { id, ...content }
  //     })
  //     setOldData(contentData)
  // }

  // const handleChange = useCallback((valueContent: dataContent) => {
  //     // const newValue = [...value]
  //     // newValue[valueContent.id] = valueContent
  //     // setValue(newValue)
  //     setValueChange(valueContent)
  // }, [])

  const handleAdd = async (type: "text" | "playground") => {
    try {
      dispatch(startLoading())
      if (thisCourse && chapterid && lessonid) {
        let content
        switch (type) {
          case "text": {
            content = {
              type,
            }
            break
          }
          case "playground": {
            content = {
              type,
              button: false,
              language: "py",
            }
            break
          }
        }
        const updateLesson = await lessonApi.addContent(
          thisCourse._id,
          chapterid as string,
          lessonid as string,
          content
        )
        dispatch(
          addContentSuccess({
            idcourse: thisCourse._id,
            idchapter: chapterid as string,
            idlesson: lessonid as string,
            lesson: updateLesson.data,
          })
        )
      }
    } catch (error) {
      console.log(error)
      dispatch(addContentFail())
    }
  }
  const handleDeleteContent = async (idcontent: string) => {
    try {
      dispatch(startLoading())
      if (thisCourse) {
        const updateLesson = await lessonApi.deleteContent(
          thisCourse._id,
          chapterid as string,
          lessonid as string,
          idcontent
        )
        dispatch(
          addContentSuccess({
            idcourse: thisCourse._id,
            idchapter: chapterid as string,
            idlesson: lessonid as string,
            lesson: updateLesson.data,
          })
        )
      }
    } catch (error) {
      dispatch(addContentFail())
    }
    // setData(data.splice(index, 1))
    // setValueSubmit(valueSubmit.splice(index, 1))
    // setData(prev => prev.splice(index, 1))
    // const newData = [...data]
    // newData.splice(index, 1)
    // setData(newData)
    // await courseApi.deleteContent(editcourse, chapterid, lessonid, index, config)
    // fetch()
  }
  // const handleEdit = (index: any) => {
  //     const url = `/user/mycourse/${router.editcourse}/addcontent?lessonid=${router.lessonid}&chapterid=${router.chapterid}/${index}`
  //     redirecRouter.push(url)
  // }
  // const handleSubmit = async () => {
  //     const config = {
  //         headers: { Authorization: `Token ${localStorage.getItem("key")}` },
  //     };
  //     data.map(async ({ id, ...newObject }) => {
  //         const value = {
  //             lesson: router.lessonid,
  //             title: "test",
  //             content: newObject
  //         }
  //         await courseApi.postContent(value, router.editcourse, router.chapterid, router.lessonid, config)
  //     })
  //     redirecRouter.push(`/user/mycourse/${router.editcourse}`)
  // }
  return (
    <HomeLayout>
      <Fragment>
        <Head>
          <title>Thêm nội dung {`${router?.editcourse}`} | NháiW3school</title>
        </Head>
        <div className={`container ${styles.wrapper}`}>
          {/* <AddContent></AddContent> */}
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
                onClick={() => redirecRouter.back()}
              >
                <h4 className={styles.text}>Thêm chương</h4>
              </a>
            </Link>
            <ChevronDoubleRight className={styles.text_icon} />
            <Link href={redirecRouter.asPath}>
              <a className="text-reset text-decoration-none">
                <h4 className={styles.text}>Thêm nội dung</h4>
              </a>
            </Link>
          </div>
          <div className={`mb-3 ${styles.sticky}`}>
            <button
              className={`${styles.button}`}
              onClick={() => handleAdd("text")}
            >
              Add text
            </button>
            <button
              className={`${styles.button}`}
              onClick={() => handleAdd("playground")}
            >
              Add PlayGround
            </button>
          </div>
          {content?.map((content) => {
            switch (content.type) {
              case "text": {
                return (
                  <div key={content._id}>
                    <button
                      className={styles.button_close}
                      onClick={() => handleDeleteContent(content._id)}
                    >
                      <XSquareFill className="text-danger fs-5" />
                    </button>
                    <Link
                      href={{
                        pathname:
                          "/user/mycourse/[editcourse]/[addcontent]/[contentid]",
                        query: {
                          editcourse: router.editcourse,
                          addcontent: `addcontent`,
                          contentid: content._id,
                          lessonid: `${router.lessonid}`,
                          chapterid: `${router.chapterid}`,
                        },
                      }}
                    >
                      <a className={styles.button_close}>
                        <PencilSquare className="text-warning fs-5" />
                      </a>
                    </Link>
                    {/* <button className={styles.button_close} onClick={() => handleEdit(index)}>
                                        <PencilSquare className='text-warning fs-5' />
                                    </button> */}
                    <SunEditor
                      setContents={content.value}
                      hideToolbar={true}
                      disable={true}
                      height="100%"
                    />
                  </div>
                )
              }
              case "playground": {
                return (
                  <div key={content._id}>
                    <button
                      className={styles.button_close}
                      onClick={() => handleDeleteContent(content._id)}
                    >
                      <XSquareFill className="text-danger fs-5" />
                    </button>
                    <Link
                      href={{
                        pathname:
                          "/user/mycourse/[editcourse]/[addcontent]/[contentid]",
                        query: {
                          editcourse: router.editcourse,
                          addcontent: `addcontent`,
                          contentid: content._id,
                          lessonid: `${router.lessonid}`,
                          chapterid: `${router.chapterid}`,
                        },
                      }}
                    >
                      <a className={styles.button_close}>
                        <PencilSquare className="text-warning fs-5" />
                      </a>
                    </Link>
                    <RunCode
                      value={content.value || ""}
                      button={content.button || false}
                      language={content.language || "py"}
                    ></RunCode>
                  </div>
                )
                // switch (content.language) {
                //   case "css":
                //   case "javascript":
                //   case "html": {
                //     return (
                //       <div key={content._id}>
                //         <button
                //           className={styles.button_close}
                //           onClick={() => handleDeleteContent(content._id)}
                //         >
                //           <XSquareFill className="text-danger fs-5" />
                //         </button>
                //         <Link
                //           href={{
                //             pathname:
                //               "/user/mycourse/[editcourse]/[addcontent]/[contentid]",
                //             query: {
                //               editcourse: router.editcourse,
                //               addcontent: `addcontent`,
                //               contentid: content.id,
                //               lessonid: `${router.lessonid}`,
                //               chapterid: `${router.chapterid}`,
                //             },
                //           }}
                //         >
                //           <a className={styles.button_close}>
                //             <PencilSquare className="text-warning fs-5" />
                //           </a>
                //         </Link>
                //         <JavaScipt
                //           value={content.value}
                //           button={content.button}
                //           theme={content.themeVS}
                //         />
                //       </div>
                //     )
                //   }
                //   case "php": {
                //     return (
                //       <div key={content.id}>
                //         <button
                //           className={styles.button_close}
                //           onClick={() => handleDeleteContent(content.id)}
                //         >
                //           <XSquareFill className="text-danger fs-5" />
                //         </button>
                //         <Link
                //           href={{
                //             pathname:
                //               "/user/mycourse/[editcourse]/[addcontent]/[contentid]",
                //             query: {
                //               editcourse: router.editcourse,
                //               addcontent: `addcontent`,
                //               contentid: content.id,
                //               lessonid: `${router.lessonid}`,
                //               chapterid: `${router.chapterid}`,
                //             },
                //           }}
                //         >
                //           <a className={styles.button_close}>
                //             <PencilSquare className="text-warning fs-5" />
                //           </a>
                //         </Link>
                //         <PHP
                //           value={content.value}
                //           button={content.button}
                //           theme={content.themeVS}
                //         />
                //       </div>
                //     )
                //   }
                //   case "java": {
                //     return (
                //       <div key={content.id}>
                //         <button
                //           className={styles.button_close}
                //           onClick={() => handleDeleteContent(content.id)}
                //         >
                //           <XSquareFill className="text-danger fs-5" />
                //         </button>
                //         <Link
                //           href={{
                //             pathname:
                //               "/user/mycourse/[editcourse]/[addcontent]/[contentid]",
                //             query: {
                //               editcourse: router.editcourse,
                //               addcontent: `addcontent`,
                //               contentid: content.id,
                //               lessonid: `${router.lessonid}`,
                //               chapterid: `${router.chapterid}`,
                //             },
                //           }}
                //         >
                //           <a className={styles.button_close}>
                //             <PencilSquare className="text-warning fs-5" />
                //           </a>
                //         </Link>
                //         <Java
                //           value={content.value}
                //           button={content.button}
                //           theme={content.themeVS}
                //         />
                //       </div>
                //     )
                //   }
                //   case "python": {
                //     return (
                //       <div key={content.id}>
                //         <button
                //           className={styles.button_close}
                //           onClick={() => handleDeleteContent(content.id)}
                //         >
                //           <XSquareFill className="text-danger fs-5" />
                //         </button>
                //         <Link
                //           href={{
                //             pathname:
                //               "/user/mycourse/[editcourse]/[addcontent]/[contentid]",
                //             query: {
                //               editcourse: router.editcourse,
                //               addcontent: `addcontent`,
                //               contentid: content.id,
                //               lessonid: `${router.lessonid}`,
                //               chapterid: `${router.chapterid}`,
                //             },
                //           }}
                //         >
                //           <a className={styles.button_close}>
                //             <PencilSquare className="text-warning fs-5" />
                //           </a>
                //         </Link>
                //         <Python
                //           value={content.value}
                //           button={content.button}
                //           theme={content.themeVS}
                //         />
                //       </div>
                //     )
                //   }
                // }
              }
            }
          })}
          {/* {data.map((content, index) => {
                        switch (content?.type) {
                            case 'text': {
                                return (
                                    <div className='mb-3' key={index} >
                                        <button className={styles.button_close} onClick={() => handleDeleteContent(index)} ><XSquareFill className='text-danger fs-5' /></button>
                                        <AddText
                                            key={index}
                                            id={index}
                                            value={content.value}
                                            onSubmit={handleChange}
                                        />
                                    </div>
                                )
                            }
                            case 'playground': {
                                return (
                                    <div className='mb-3' key={index} >
                                        <button className={styles.button_close} onClick={() => handleDeleteContent(index)} ><XSquareFill className='text-danger fs-5' /></button>
                                        <AddPlayGround
                                            key={index}
                                            id={index}
                                            currentButton={content.button}
                                            currentLanguage={content.language}
                                            onSubmit={handleChange}
                                            currentValue={content.value}
                                        />
                                    </div>
                                )
                            }
                        }
                    })} */}
          {/* <button className={styles.button} onClick={() => handleSubmit()} >Submit</button> */}
        </div>
      </Fragment>
    </HomeLayout>
  )
}

export default withAuth(AddContentPage)
