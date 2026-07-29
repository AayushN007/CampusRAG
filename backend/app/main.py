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
        "https://campus-rag-silk.vercel.app",
        "http://localhost:5173"
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