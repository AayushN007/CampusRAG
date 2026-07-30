import { useState, useRef, useEffect } from "react";
import API from "./services/api";
import ChatMessage from "./components/ChatMessage";
import Spinner from "./components/Spinner";

function App() {
  const [files, setFiles] = useState([]);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sources, setSources] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const chatEndRef = useRef(null);

  // Auto-scroll chat to the bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const clearDocuments = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all uploaded PDFs? This action cannot be undone."
      )
    ) {
      return;
    }

    setClearing(true);

    try {
      await API.delete("/clear-documents");

      setChatHistory([]);
      setSources([]);
      setFiles([]);
      setQuestion("");
      setPdfUploaded(false);
      setMessage("✅ Knowledge base cleared successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "❌ Failed to clear knowledge base."
      );
    } finally {
      setClearing(false);
    }
  };

  const uploadFile = async () => {
    if (files.length === 0) {
      setMessage("Please select PDF files first.");
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    setMessage("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        await API.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setUploadProgress({ current: i + 1, total: files.length });
      }

      setMessage(`✅ All ${files.length} PDFs uploaded successfully!`);
      setPdfUploaded(true);
      setFiles([]); // clear selection after success
    } catch (error) {
      setMessage(error.response?.data?.detail || "❌ Upload failed.");
      setPdfUploaded(false);
    } finally {
      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const askQuestion = async () => {
    if (!question.trim() || !pdfUploaded || loading) return;

    const userQuestion = question.trim();
    setQuestion("");
    setLoading(true);
    setSources([]);

    setChatHistory((prev) => [
      ...prev,
      { role: "user", content: userQuestion },
    ]);

    try {
      const response = await API.post("/chat", {
        question: userQuestion,
      });

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: response.data.answer },
      ]);
      setSources(response.data.sources || []);
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || "Something went wrong.";
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setQuestion("");
    setChatHistory([]);
    setSources([]);
  };

  const isAnyActionBusy = loading || uploading || clearing;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white py-6 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
            🎓 CampusRAG
          </h1>
          <p className="text-slate-300 mt-1 text-sm sm:text-base">
            AI-powered PDF Question Answering
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 flex-grow space-y-6">
        {/* Upload Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-800">
            Upload PDFs
          </h2>

          <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 sm:p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition">
            <span className="text-4xl sm:text-5xl mb-2">📄</span>
            <p className="font-semibold text-slate-700 text-center">
              Click to choose PDFs
            </p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 text-center">
              Multiple PDF files supported
            </p>
            <input
              type="file"
              accept="application/pdf"
              multiple
              className="hidden"
              disabled={isAnyActionBusy}
              onChange={(e) => {
                setFiles(Array.from(e.target.files));
                setPdfUploaded(false); // reset so user can re-upload
              }}
            />
          </label>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="mt-4 bg-slate-50 rounded-lg p-3 border border-slate-200">
              <strong className="text-sm text-slate-700 block mb-2">
                Selected PDFs ({files.length}):
              </strong>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {files.map((file, index) => (
                  <p
                    key={index}
                    className="text-sm text-slate-600 truncate flex items-center gap-2"
                  >
                    <span>📄</span> {file.name}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button & Message */}
          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={uploadFile}
              disabled={uploading || files.length === 0 || isAnyActionBusy}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Spinner />
                  Uploading {uploadProgress.current}/{uploadProgress.total}...
                </>
              ) : (
                "Upload PDFs"
              )}
            </button>

            {message && (
              <p
                className={`text-sm font-medium ${
                  message.includes("❌") || message.includes("failed")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </section>

        {/* Chat Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-800">
            Chat
          </h2>

          {/* Chat Messages */}
          <div className="min-h-[300px] max-h-[450px] overflow-y-auto mb-6 p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
                Upload PDFs and ask questions to begin.
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <ChatMessage
                  key={index}
                  role={msg.role}
                  content={msg.content}
                />
              ))
            )}

            {loading && (
              <ChatMessage
                role="assistant"
                content={
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" /> AI is thinking...
                  </div>
                }
              />
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Field */}
          <div className="relative">
            <textarea
              rows={3}
              value={question}
              placeholder={
                pdfUploaded
                  ? "Ask anything about your PDFs..."
                  : "Upload PDFs first to enable chat..."
              }
              disabled={!pdfUploaded || isAnyActionBusy}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  askQuestion();
                }
              }}
              className="w-full border border-slate-300 rounded-xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed resize-none transition text-sm sm:text-base"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              onClick={askQuestion}
              disabled={
                loading || !pdfUploaded || !question.trim() || isAnyActionBusy
              }
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner /> Thinking...
                </>
              ) : (
                "Ask AI"
              )}
            </button>

            <button
              onClick={clearChat}
              disabled={isAnyActionBusy}
              className="w-full sm:w-auto bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition"
            >
              Clear Chat
            </button>

            <button
              onClick={clearDocuments}
              disabled={isAnyActionBusy}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition sm:ml-auto flex items-center justify-center gap-2"
            >
              {clearing ? (
                <>
                  <Spinner /> Clearing...
                </>
              ) : (
                "Clear Knowledge Base"
              )}
            </button>
          </div>

          {/* Sources Section */}
          {sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-slate-800">
                📚 Sources
              </h3>

              <div className="space-y-4">
                {sources.map((source, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50 shadow-sm"
                  >
                    <p className="font-semibold text-blue-700 text-base sm:text-lg break-all">
                      📄 {source.filename || "Unknown Document"}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-2 text-xs sm:text-sm text-slate-500">
                      <span>📑 Page {source.page}</span>
                      {source.score !== undefined && (
                        <span>⭐ Score {source.score}</span>
                      )}
                    </div>

                    {source.preview && (
                      <p className="text-slate-700 text-sm mt-3 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                        "{source.preview}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;