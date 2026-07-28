from app.services.pdf_service import extract_text_from_pdf

pdf_path = "uploads/_OceanofPDF.com_Cant_hurt_me_-_David_Goggins.pdf"

text = extract_text_from_pdf(pdf_path)

print(text[:1000])