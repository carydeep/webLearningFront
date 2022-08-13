import Editor from "@monaco-editor/react"
import React, { useRef, useState } from "react"
import axios, { AxiosResponse } from "axios"
import styles from "../../styles/code.module.css"
import { Button, Toast } from "react-bootstrap"

type CodeResponse = {
  out: string
  err: string
  time: string
}

interface runPhp {
  value: string
  button: boolean
  theme: boolean
}

const run_code = async (code: string) => {
  const url = "/run-code/java/"
  const response: AxiosResponse<CodeResponse> = await axios.post(url, {
    code: code,
  })
  const data = response.data
  return data
}

const Java = (props: runPhp) => {
  const { value, button, theme } = props
  const editorRef = useRef(null)
  const [code, set_code] = React.useState<string>(value)
  const [output, set_output] = React.useState<string>("")
  const [error, set_error] = React.useState<string>("")
  const [time, set_time] = React.useState<string>("")
  const [close, setClose] = useState<boolean>(true)

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      set_code(value)
    }
  }

  const handleClick = () => {
    run_code(code)
      .then((data) => {
        set_output(data.out)
        set_error(data.err)
        set_time(data.time)
      })
      .catch((err) => {
        // console.log(err)
      })
    setClose(false)
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

  return (
    <>
      <Editor
        height="30vh"
        theme={theme ? "vs-dark" : "light"}
        defaultLanguage="java"
        language="java"
        defaultValue={code}
        onChange={(value) => handleChange(value)}
        onMount={handleEditorDidMount}
      />
      {button ? (
        <div>
          <Button type="button" onClick={handleClick}>
            Run
          </Button>
          {!close && (
            <Toast
              bg={error !== "" ? "danger" : "dark"}
              style={{ width: "100%" }}
              onClose={closeRunCode}
            >
              <Toast.Header>
                <strong className="me-auto">Kết quả code</strong>
                <small>{time}</small>
              </Toast.Header>
              <Toast.Body
                className={`${styles.code_container} ${
                  error !== "" ? "" : "text-white"
                }`}
              >
                {output !== "" && output}
                {error !== "" && error}
              </Toast.Body>
            </Toast>
          )}
        </div>
      ) : null}
    </>
  )
}

export default Java
