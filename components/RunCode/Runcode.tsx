import Editor from "@monaco-editor/react"
import React, { useRef, useState } from "react"
import styles from "../../styles/code.module.css"
import { Button, Toast } from "react-bootstrap"
import runcodeApi from "../../pages/api/runcodeApi"
import { useTheme } from "next-themes"

interface outputProps {
  error?: string
  langague: string
  success: boolean
  output?: string
}

interface runCodeProps {
  value: string
  button: boolean
  language: string
  theme?: boolean
}

const RunCode = (props: runCodeProps) => {
  const theme = useTheme()
  const { value, button, language } = props
  const editorRef = useRef(null)
  const [code, setCode] = React.useState<string>(value)
  const [time, setTime] = React.useState<number>()
  const [close, setClose] = useState<boolean>(true)
  const [output, setOutput] = useState<outputProps>()

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
    }
  }

  function handleEditorDidMount(editor: any) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor
    editor.updateOptions({
      readOnly: !button,
    })
  }

  function closeRunCode() {
    setClose(true)
  }

  const hanldeRun = async () => {
    const start = Date.now()
    const res = await runcodeApi.run(code, language)
    const finish = Date.now()
    const time = (finish - start) / 1000
    setTime(time)
    setClose(false)
    setOutput(res.data)
  }

  return (
    <>
      <Editor
        height="30vh"
        theme={theme.theme === "light" ? "vs-dark" : "light"}
        defaultLanguage={language}
        language={language}
        defaultValue={code}
        onChange={(value) => handleChange(value)}
        onMount={handleEditorDidMount}
      />
      {button ? (
        <div>
          <Button type="button" onClick={hanldeRun}>
            Run
          </Button>
          {!close && (
            <Toast
              bg={output?.success ? "dark" : "danger"}
              style={{ width: "100%" }}
              onClose={closeRunCode}
            >
              <Toast.Header>
                <strong className="me-auto">Kết quả code</strong>
                <small>{time + "s"}</small>
              </Toast.Header>
              <Toast.Body
                className={`${styles.code_container} ${
                  output?.success ? "text-white" : ""
                }`}
              >
                {output?.success ? output?.output : output?.error}
              </Toast.Body>
            </Toast>
          )}
        </div>
      ) : null}
    </>
  )
}

export default RunCode
