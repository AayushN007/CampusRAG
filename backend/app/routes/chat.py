from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag_service import ask_rag


router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def chat(request: ChatRequest):

    response = ask_rag(request.question)

    return response