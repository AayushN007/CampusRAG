from app.services.pdf_service import extract_text_from_pdf
from app.services.chunk_service import split_text_into_chunks
from app.services.embedding_service import generate_embeddings
from app.services.vector_service import store_embeddings


pdf_path = "uploads/_OceanofPDF.com_Cant_hurt_me_-_David_Goggins.pdf"

text = extract_text_from_pdf(pdf_path)

chunks = split_text_into_chunks(text)

embeddings = generate_embeddings(chunks[:5])

result = store_embeddings(chunks[:5], embeddings)

print(result)