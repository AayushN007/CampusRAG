import { useState } from "react";
import axios from "axios";
import ChatMessage from "./components/ChatMessage";

function App() {

  const [files, setFiles] = useState([]);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);



  const uploadFile = async () => {

    if (files.length === 0) {
      setMessage("Please select PDF files first.");
      return;
    }


    try {

      setMessage("Uploading PDFs...");


      for (const file of files) {

        const formData = new FormData();

        formData.append("file", file);


        await axios.post(
          "https://campusrag-production.up.railway.app/upload",
          formData
        );

      }


      setMessage("All PDFs uploaded successfully!");
      setPdfUploaded(true);


    } catch (error) {

      setMessage("Upload failed.");
      setPdfUploaded(false);

    }

  };





  const askQuestion = async () => {

    if (!question.trim() || !pdfUploaded)
      return;


    const userQuestion = question;


    setQuestion("");
    setLoading(true);
    setSources([]);



    setChatHistory((prev) => [

      ...prev,

      {
        role: "user",
        content: userQuestion
      }

    ]);



    try {

      const response = await axios.post(

        "https://campusrag-production.up.railway.app/chat",

        {
          question: userQuestion
        }

      );



      setChatHistory((prev) => [

        ...prev,

        {
          role: "assistant",
          content: response.data.answer
        }

      ]);



      setSources(
        response.data.sources || []
      );



    } catch (error) {


      setChatHistory((prev) => [

        ...prev,

        {
          role: "assistant",
          content: "Something went wrong."
        }

      ]);

    }


    finally {

      setLoading(false);

    }

  };





  const clearChat = () => {

    setQuestion("");
    setChatHistory([]);
    setSources([]);

  };





  return (

    <div className="min-h-screen bg-slate-100">


      <header className="bg-slate-900 text-white py-6 shadow">

        <div className="max-w-5xl mx-auto px-6">

          <h1 className="text-4xl font-bold">
            🎓 CampusRAG
          </h1>

          <p className="text-slate-300 mt-2">
            AI-powered PDF Question Answering
          </p>

        </div>

      </header>





      <main className="max-w-5xl mx-auto p-6">



        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">


          <h2 className="text-2xl font-bold mb-6">
            Upload PDFs
          </h2>



          <label className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">


            <span className="text-5xl">
              📄
            </span>


            <p className="mt-3 font-semibold">
              Click to choose PDFs
            </p>


            <p className="text-sm text-gray-500">
              Multiple PDF files supported
            </p>



            <input

              type="file"

              accept="application/pdf"

              multiple

              className="hidden"

              onChange={(e) =>
                setFiles(
                  Array.from(e.target.files)
                )
              }

            />


          </label>




          {files.length > 0 && (

            <div className="mt-4 bg-slate-100 rounded-lg p-3">

              <strong>
                Selected PDFs:
              </strong>


              {files.map((file,index)=>(

                <p key={index}>
                  📄 {file.name}
                </p>

              ))}


            </div>

          )}




          <button

            onClick={uploadFile}

            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"

          >

            Upload PDFs

          </button>




          {message && (

            <p className="mt-4 text-green-600 font-medium">

              {message}

            </p>

          )}



        </div>







        <div className="bg-white rounded-2xl shadow-lg p-8">


          <h2 className="text-2xl font-bold mb-5">
            Chat
          </h2>





          <div className="min-h-[300px] max-h-[500px] overflow-y-auto mb-6">


            {chatHistory.length === 0 ? (

              <p className="text-gray-500">
                Upload PDFs and ask questions.
              </p>


            ) : (

              chatHistory.map((msg,index)=>(

                <ChatMessage

                  key={index}

                  role={msg.role}

                  content={msg.content}

                />

              ))

            )}


          </div>





          <textarea

            rows={3}

            value={question}

            placeholder={
              pdfUploaded
              ? "Ask anything about your PDFs..."
              : "Upload PDFs first..."
            }


            disabled={!pdfUploaded}


            onChange={(e)=>
              setQuestion(e.target.value)
            }


            onKeyDown={(e)=>{

              if(e.key==="Enter" && !e.shiftKey){

                e.preventDefault();

                askQuestion();

              }

            }}


            className="w-full border rounded-lg p-4 resize-none"

          />





          <div className="flex gap-3 mt-5">


            <button

              onClick={askQuestion}

              disabled={
                loading || !pdfUploaded
              }


              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"

            >

              {
                loading
                ? "Thinking..."
                : "Ask AI"
              }

            </button>




            <button

              onClick={clearChat}

              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"

            >

              Clear

            </button>


          </div>







          {sources.length > 0 && (

            <div className="mt-8">


              <h3 className="text-xl font-bold mb-4">
                📚 Sources
              </h3>




              <div className="space-y-4">



                {sources.map((source,index)=>(


                  <div

                    key={index}

                    className="border rounded-xl p-5 bg-slate-50"

                  >



                    <p className="font-bold text-blue-700 text-lg">

                      📄 {source.filename || "Unknown Document"}

                    </p>




                    <div className="flex gap-4 mt-2 text-sm text-gray-600">


                      <span>
                        📑 Page {source.page}
                      </span>


                      <span>
                        ⭐ Score {source.score}
                      </span>


                    </div>




                    <p className="text-gray-700 mt-3">

                      {source.preview}

                    </p>



                  </div>


                ))}


              </div>


            </div>

          )}



        </div>



      </main>


    </div>

  );

}


export default App;