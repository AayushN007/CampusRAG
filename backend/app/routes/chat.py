from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag_service import ask_rag
from app.services.vector_service import clear_documents

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def chat(request: ChatRequest):

    response = ask_rag(request.question)

    return response


@router.delete("/clear-documents")
def clear_all_documents():

    return clear_documents()