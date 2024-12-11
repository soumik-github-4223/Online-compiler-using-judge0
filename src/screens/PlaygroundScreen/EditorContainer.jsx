import { useRef, useState } from "react";
import "./EditorContainer.css";
import { Editor } from "@monaco-editor/react";
import { makeSubmission } from "./service";

const editorOptions = {
  fontSize: 18,
  wordWrap: "on",
};

export const EditorContainer = ({runCode}) => {
  const [code, setCode] = useState("");
  const codeRef=useRef();
  const [language,setLanguage]=useState('cpp')
  const [theme,setTheme]=useState('vs-dark')
  const [isFullScreen,setIsFullScreen]=useState(false)

    const onChangeLanguage=(e)=>{
        setLanguage(e.target.value);
    }
    const onChangeTheme=(e)=>{
        setTheme(e.target.value)
    }

//   console.log(codeRef);

  const onChangeCode = (newCode) => {
    codeRef.current=newCode;
    // console.log({ newCode });
  };

  const onUploadCode = (event) => {
    const file = event.target.files[0];
    const fileType = file.type.includes("text");
    if (fileType) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = function (value) {
        // console.log(value.target.result);
        const importedCode = value.target.result;
        setCode(importedCode);
        codeRef.current=importedCode;
      };
    } else {
      alert("Please choose a program file");
    }
  };


  const onRunCode=()=>{
    runCode({
        code: codeRef.current,
        language
    })
  }

  return (
    <div className="root-editor-container">
      <div className="editor-header">
        <div className="editor-left-container">
          <b className="title of the card">Title of the card</b>
          <span className="material-icons">edit</span>
          <button>Save Code</button>
        </div>
        <div className="editor-right-container">
          <select onChange={onChangeLanguage} value={language}>
            <option value="cpp">cpp</option>
            <option value="javascript">javascript</option>
            <option value="java">java</option>
            <option value="python">python</option>
          </select>
          <select onChange={onChangeTheme} value={theme}>
            <option value="vs-light">light</option>
            <option value="vs-dark">dark</option>
          </select>
        </div>
      </div>
      <div className="editor-body">
        <Editor
          language={language}
          theme={theme}
          options={editorOptions}
          onChange={onChangeCode}
          value={code}
        />
      </div>
      <div className="editor-footer">
        <button>Full screen</button>
        <input type="file" id="import-code" onChange={onUploadCode} />
        <button>Export code</button>
        <button onClick={onRunCode}>Run</button>
      </div>

      
    </div>
  );
};
