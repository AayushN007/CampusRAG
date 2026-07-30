from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid

from app.services.pdf_service import extract_text_from_pdf
from app.services.chunk_service import split_text_into_chunks
from app.services.embedding_service import generate_embeddings
from app.services.vector_service import (
    store_embeddings,
    clear_documents,
)

router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    if file.content_type != "application/pdf":

        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    document_id = str(uuid.uuid4())

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    pages = extract_text_from_pdf(file_path)

    chunks = split_text_into_chunks(pages)

    for chunk in chunks:
        chunk["filename"] = file.filename
        chunk["document_id"] = document_id

    embeddings = generate_embeddings(chunks)

    result = store_embeddings(
        chunks,
        embeddings
    )

    return {
        "filename": file.filename,
        "document_id": document_id,
        "message": "PDF processed successfully!",
        "stored_chunks": result["stored_chunks"]
    }


@router.delete("/clear")
def clear_database():

    result = clear_collection()

    return {
        "message": "Knowledge base cleared successfully!",
        "deleted_chunks": result["deleted_chunks"]
    }