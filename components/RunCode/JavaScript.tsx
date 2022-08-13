import Editor from "@monaco-editor/react"
import React, { useRef, useState } from "react"
import axios, { AxiosResponse } from "axios"
import code_styles from "../../styles/code.module.css"
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
  const url = "/php/run"
  const response: AxiosResponse<CodeResponse> = await axios.post(url, {
    code: code,
  })
  const data = response.data
  return data
}

const JavaScipt = (props: runPhp) => {
  const { value, button, theme } = props
  const editorRef = useRef(null)
  const [code, set_code] = React.useState<string>(value)
  const [output, set_output] = React.useState<string>("")
  const [close, setClose] = useState<boolean>(true)

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      set_code(value)
    }
  }

  const handleClick = () => {
    set_output(`
        ${code}`)
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
        defaultLanguage="html"
        language="html"
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
            <Toast style={{ width: "100%" }} onClose={closeRunCode}>
              <Toast.Header>
                <strong className="me-auto">Kết quả code</strong>
              </Toast.Header>
              <Toast.Body>
                <iframe
                  srcDoc={output}
                  title="output"
                  sandbox="allow-scripts"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                ></iframe>
              </Toast.Body>
            </Toast>
          )}
        </div>
      ) : null}
    </>
  )
}

export default JavaScipt
