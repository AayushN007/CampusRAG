from app.services.pdf_service import extract_text_from_pdf
from app.services.chunk_service import split_text_into_chunks

pdf_path = "uploads/_OceanofPDF.com_Cant_hurt_me_-_David_Goggins.pdf"

text = extract_text_from_pdf(pdf_path)

chunks = split_text_into_chunks(text)

print("Total chunks:", len(chunks))

print("\nFirst chunk:\n")
print(chunks[0])