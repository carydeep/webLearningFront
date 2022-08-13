import React, { useState, memo } from "react"
import dynamic from "next/dynamic"
import "suneditor/dist/css/suneditor.min.css"
import styles from "../../styles/AddPlayGround.module.css"
import { useRouter } from "next/router"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  addContentFail,
  addContentSuccess,
  startLoading,
} from "../../redux/slices/courseSlice"
import lessonApi from "../../pages/api/lessonApi"

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
})

interface addText {
  value: string
}

function AddText(props: addText) {
  const router = useRouter()
  const { editcourse, lessonid, chapterid, contentid } = router.query
  const dispatch = useAppDispatch()
  const thisCourse = useAppSelector((state) =>
    state.courseReducer.mycourse?.find((course) => course.slug === editcourse)
  )
  const { value } = props
  const [currentValue, setCurrentValue] = useState<string>(value)
  function handleChange(content: string) {
    setCurrentValue(content)
  }
  const handleSubmit = async () => {
    try {
      dispatch(startLoading())
      if (editcourse && lessonid && chapterid && contentid && thisCourse) {
        const updateContent = {
          value: currentValue,
        }
        const update = await lessonApi.updateContentById(
          thisCourse._id,
          chapterid as string,
          lessonid as string,
          contentid as string,
          updateContent
        )
        dispatch(
          addContentSuccess({
            idcourse: thisCourse._id,
            idchapter: chapterid as string,
            idlesson: lessonid as string,
            lesson: update.data,
          })
        )
        router.back()
      }
    } catch (error) {
      dispatch(addContentFail())
    }
  }

  return (
    <div>
      <SunEditor
        setContents={currentValue}
        onChange={handleChange}
        // onBlur={onSubmit({ id, value: currentValue, type })}
        setOptions={{
          buttonList: [
            ["undo", "redo"],
            ["font", "fontSize"],
            ["paragraphStyle", "blockquote"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
            ],
            ["fontColor", "hiliteColor"],
            ["align", "list", "lineHeight"],
            ["outdent", "indent"],

            ["table", "horizontalRule", "link", "image", "video"],
            // ['math'], //You must add the 'katex' library at options to use the 'math' plugin.
            // ['imageGallery'], // You must add the "imageGalleryUrl".
            ["fullScreen", "showBlocks", "codeView"],
            ["preview", "print"],
            ["removeFormat"],

            // ['save', 'template'],
            // ['/'],// Line break
          ],
          defaultTag: "div",
          minHeight: "300px",
          showPathLabel: false,
        }}
        height="100%"
      />
      <button
        className={`${styles.button} mt-3`}
        onClick={() => handleSubmit()}
      >
        Submit
      </button>
    </div>
  )
}

export default AddText
