// import { useParams } from "react-router-dom"
import { useCallback, useState } from "react";
import { EditorContainer } from "./screens/PlaygroundScreen/EditorContainer";
import { makeSubmission } from "./screens/PlaygroundScreen/service";

function App() {
  // const params=useParams();
  // console.log(params);
   
  const [input,setInput]=useState('')
  const [output,setOutput]=useState('')
  const [showLoader,setShowLoader]=useState(false)

  const importInput=(e)=>{
    const file=e.target.files[0];
    console.log(file)
    const fileType = file.type.includes("text");
    if (fileType) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = (e) =>{
        setInput(e.target.result);
      };
    } else {
      alert("Please choose a text file");
    }
  }

  const callback=({apiStatus,data,message})=>{
    if(apiStatus==='loading'){
      setShowLoader(true)
    }
    else if(apiStatus==='error'){
      setShowLoader(false)
      // console.log(apiStatus)
      setOutput('Some thing wrong')
    }
    else{
      // console.log(data)
      // console.log(data.status.description)
      setShowLoader(false)
      if(data.status.id===3){
        setOutput(atob(data.stdout))
      }
      else{
        setOutput(data.status.description)
      }
    }
  }

  const runCode=useCallback(({code,language})=>{
    makeSubmission({code,language,stdin:input,callback})
  },[input])

  return (
    <div className="playground-container">
      <div className="header">
        <img src="/logo.png" alt="logo" className="logo"/>
      </div>
      {/* <EditorContainer/> */}

      <div className="content-container">
        <div className="editor-container">
          <EditorContainer
          runCode={runCode}
          />
        </div>
        <div className="input-container">
          <div className="input-header">Input
            <input type="file" onChange={importInput}/>
          </div>
          <textarea value={input} onChange={(e)=>setInput(e.target.value)} name="" id=""></textarea>
        </div>

        <div className="input-container">Output
          <button>Export</button>
          <textarea readOnly value={output} onChange={(e)=> setOutput(e.target.value)} name="" id=""></textarea>
        </div>
      </div>
      
      {showLoader && <div className="fullpage-loader">
        <div className="loader">

        </div>
      </div>}

    </div>
  )
}

export default App;
