import Editor from "@monaco-editor/react"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { Form } from "react-bootstrap"
import lessonApi from "../../pages/api/lessonApi"
import runcodeApi from "../../pages/api/runcodeApi"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import {
  addContentFail,
  addContentSuccess,
  startLoading,
} from "../../redux/slices/courseSlice"
import styles from "../../styles/AddPlayGround.module.css"

interface addPlayGround {
  currentButton?: boolean
  currentValue: any
  currentLanguage: any
}

function AddPlayGround(props: addPlayGround) {
  const router = useRouter()
  const { currentValue, currentButton, currentLanguage } = props
  const { editcourse, lessonid, chapterid, contentid } = router.query
  const dispatch = useAppDispatch()
  const thisCourse = useAppSelector((state) =>
    state.courseReducer.mycourse?.find((course) => course.slug === editcourse)
  )
  const editorRef = useRef<any>(null)
  const [language, setLanguage] = useState<string>(currentLanguage)
  const [addrLanguage, setAddrLanguage] = useState<Array<string>>([])

  const [value, setValue] = useState<string>("")

  const [button, setButton] = useState<boolean>(currentButton || false)

  useEffect(() => {
    const getLanguage = async () => {
      const res = await runcodeApi.getLanguage()
      const languages = res.data.supportedLanguages.map(
        (lang: { language: any }) => lang.language
      )
      setAddrLanguage(languages)
    }
    getLanguage()
  }, [])

  const Add = addrLanguage.map((Add) => Add)
  const handleAddrTypeChange = (e: any) => setLanguage(e.target.value)

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor
  }

  const handleSubmit = async () => {
    try {
      dispatch(startLoading())
      if (editcourse && lessonid && chapterid && contentid && thisCourse) {
        const updateContent = {
          value,
          button,
          language,
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
  function showValue() {
    setValue(editorRef.current?.getValue())
  }
  return (
    <div>
      <div className="d-flex align-items-center">
        <select
          onChange={(e) => handleAddrTypeChange(e)}
          className={styles.select}
          value={language}
        >
          {Add.map((address, key) => (
            <option key={key} value={address}>
              {address}
            </option>
          ))}
        </select>
        <div className={styles.button}>
          <label htmlFor="buttonRun">Add button run code ?</label>
          <input
            className="ms-2"
            type="checkbox"
            checked={button}
            id="buttonRun"
            onChange={() => setButton(!button)}
          />
        </div>
      </div>
      <Editor
        height="90vh"
        defaultLanguage={language}
        language={language}
        defaultValue={currentValue}
        onMount={handleEditorDidMount}
        onChange={showValue}
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

export default AddPlayGround
