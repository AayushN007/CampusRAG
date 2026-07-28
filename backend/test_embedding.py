from app.services.pdf_service import extract_text_from_pdf
from app.services.chunk_service import split_text_into_chunks
from app.services.embedding_service import generate_embeddings

pdf_path = "uploads/_OceanofPDF.com_Cant_hurt_me_-_David_Goggins.pdf"

text = extract_text_from_pdf(pdf_path)

chunks = split_text_into_chunks(text)

embeddings = generate_embeddings(chunks[:3])

print("Number of embeddings:", len(embeddings))

print("Embedding size:", len(embeddings[0]))