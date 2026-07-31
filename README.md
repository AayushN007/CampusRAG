# 🎓 CampusRAG

> **AI-Powered PDF Question Answering System using Retrieval-Augmented Generation (RAG)**

CampusRAG is a Retrieval-Augmented Generation (RAG) application that enables users to upload one or more PDF documents and ask natural language questions about their content. Instead of relying solely on a Large Language Model (LLM), the system retrieves the most relevant document chunks using vector search and generates accurate, context-aware answers with source citations.

The application combines **React**, **FastAPI**, **LangChain**, **ChromaDB**, **Hugging Face Embeddings**, and the **Groq LLM** to provide fast and reliable document-based question answering.

## Live Demo

🌐 Frontend: https://your-vercel-url

⚙️ Backend API: https://your-railway-url/docs

---

# 📌 Project Overview

Traditional AI models cannot answer questions about private documents unless the information is provided during inference. CampusRAG solves this problem using the Retrieval-Augmented Generation (RAG) architecture.

The workflow is:

1. Upload PDF documents.
2. Extract text from PDFs.
3. Split text into manageable chunks.
4. Convert chunks into vector embeddings.
5. Store embeddings in ChromaDB.
6. Retrieve the most relevant chunks for a user query.
7. Send retrieved context to the Groq LLM.
8. Generate an accurate answer with document citations.

---

# ✨ Features

- 📄 Upload one or multiple PDF documents
- 🤖 AI-powered question answering
- 🔍 Retrieval-Augmented Generation (RAG)
- 📚 Source citations with page numbers
- ⚡ Fast responses using Groq LLM
- 🗂 Vector similarity search using ChromaDB
- 💬 Clean chat interface
- 🧹 Clear chat history
- 🗑 Clear entire knowledge base
- 📱 Responsive user interface
- 🎨 Modern Tailwind CSS design

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Axios

## Backend

- FastAPI
- Python
- LangChain
- ChromaDB
- Hugging Face Sentence Transformers
- Groq API
- Uvicorn

---

# 🏗 System Architecture

```text
                User
                  │
                  ▼
        React Frontend (Vite)
                  │
      HTTP Requests (Axios)
                  │
                  ▼
        FastAPI Backend Server
                  │
       ┌──────────┴──────────┐
       │                     │
 PDF Upload API         Chat API
       │                     │
       ▼                     ▼
 PDF Loader           User Question
       │                     │
 Text Splitter              │
       │                     │
 Embedding Model            │
       │                     │
   ChromaDB Vector Store ◄──┘
            │
     Similarity Search
            │
 Retrieved Context
            │
       Groq LLM
            │
 Generated Answer + Sources
            │
            ▼
      React Frontend
```

---

# 📂 Project Structure

```text
CampusRAG/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── rag.py
│   │   ├── ...
│   │
│   ├── uploads/
│   ├── chroma_db/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙ Installation

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/CampusRAG.git

cd CampusRAG
```

---

## 2. Backend Setup

Create a virtual environment

```bash
python -m venv .venv
```

Activate it

### Windows

```bash
.venv\Scripts\activate
```

### macOS/Linux

```bash
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r backend/requirements.txt
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
GROQ_API_KEY=your_groq_api_key
```

Create a `.env` file inside the frontend folder.

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

# ▶ Running the Project

## Start Backend

```bash
cd backend

uvicorn app.main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

## Start Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/upload` | Upload PDF documents |
| POST | `/chat` | Ask questions |
| DELETE | `/clear-documents` | Delete uploaded documents |

---

# 📷 Screenshots

## Home Page

<img width="1447" height="790" alt="Screenshot 2026-07-30 at 6 08 28 PM" src="https://github.com/user-attachments/assets/d71d6e8f-9896-49ec-a318-991b6d099a77" />


---

## PDF Upload

<img width="1470" height="956" alt="Screenshot 2026-07-28 at 7 40 08 PM" src="https://github.com/user-attachments/assets/3a4402ce-e9d4-4208-b5e3-1f1e8db51c3f" />


---

## Chat Interface

<img width="1470" height="956" alt="Screenshot 2026-07-28 at 7 41 24 PM" src="https://github.com/user-attachments/assets/35ca6fb4-613d-4d8d-9955-be187717ea00" />


---

## AI Answer with Sources

<img width="1470" height="956" alt="Screenshot 2026-07-28 at 7 41 24 PM" src="https://github.com/user-attachments/assets/f3f077a4-858d-4963-ba85-6b3b47aceaf5" />


---

## Swagger API Documentation

<img width="1470" height="956" alt="Screenshot 2026-07-28 at 7 41 44 PM" src="https://github.com/user-attachments/assets/77b6471f-654c-444c-8ca0-33120b622dfe" />


---

# 🚀 Future Improvements

- User authentication
- Chat history persistence
- OCR support for scanned PDFs
- Drag-and-drop PDF upload
- PDF preview inside the application
- Streaming AI responses
- Cloud storage integration
- Docker deployment
- Role-based access control
- Support for Word, PowerPoint, and Excel files
- Multi-language document support

---

# 👨‍💻 Author

**Aayush N**

Bachelor of Engineering (B.E.)

GitHub: https://github.com/AayushN007

LinkedIn: www.linkedin.com/in/aayush-n-58988228b

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Acknowledgements

This project was built using:

- React
- FastAPI
- LangChain
- ChromaDB
- Hugging Face Sentence Transformers
- Groq API
- Tailwind CSS
- Vite

---

## 🌟 If you found this project useful, consider giving it a star on GitHub!
