from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes.health import router as health_router
from app.routes.upload import router as upload_router
from app.routes.chat import router as chat_router

app = FastAPI(title=settings.app_name)

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://campus-rag-silk.vercel.app",
        "https://campus-rag-git-main-aayushn007s-projects.vercel.app",
        "https://campus-en1p1mcqq-aayushn007s-projects.vercel.app",
        "https://campusrag.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health_router)
app.include_router(upload_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {
        "message": f"{settings.app_name} Backend is running!"
    }