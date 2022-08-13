import React from "react"
import "suneditor/dist/css/suneditor.min.css"
import dynamic from "next/dynamic"
import { Content } from "../../models/lesson"
import RunCode from "../RunCode/Runcode"

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
})

export interface ContentProps {
  data: Array<Content>
}

function ContentChapter(props: ContentProps) {
  const { data } = props
  return (
    <div>
      {/* {data.length > 0 && (
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Dark mode code"
          className="ms-auto"
          onChange={() => setTheme(!theme)}
          checked={theme}
        />
      )} */}
      {data.map((content) => {
        switch (content.type) {
          case "text": {
            return (
              <SunEditor
                key={content._id}
                setContents={content.value}
                hideToolbar={true}
                disable={true}
                height="100%"
              />
            )
          }
          case "playground": {
            return (
              <div key={content._id}>
                <RunCode
                  value={content.value}
                  button={content.button || true}
                  language={content.language || "py"}
                ></RunCode>
              </div>
            )
            // switch (content?.content.language) {
            //     case 'css':
            //     case 'javascript':
            //     case 'html': {
            //         return (
            //             <div key={content.id}>
            //                 <JavaScipt
            //                     value={content.content.value}
            //                     button={content.content.button}
            //                     theme={theme}
            //                 />
            //             </div>
            //         )
            //     }
            //     case 'php': {
            //         return (
            //             <div key={content.id}>
            //                 <PHP
            //                     value={content.content.value}
            //                     button={content.content.button}
            //                     theme={theme}
            //                 />
            //             </div>
            //         )
            //     }
            //     case 'java': {
            //         return (
            //             <div key={content.id}>
            //                 <Java
            //                     value={content.content.value}
            //                     button={content.content.button}
            //                     theme={theme}
            //                 />
            //             </div>
            //         )
            //     }
            //     case 'python': {
            //         return (
            //             <div key={content.id}>
            //                 <Python
            //                     value={content.content.value}
            //                     button={content.content.button}
            //                     theme={theme}
            //                 />
            //             </div>
            //         )
            //     }
            // }
          }
        }
      })}
    </div>
  )
}

export default ContentChapter
