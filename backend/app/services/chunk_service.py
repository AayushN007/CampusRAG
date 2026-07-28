def split_text_into_chunks(pages, chunk_size=500, overlap=100):

    chunks = []

    for page in pages:

        page_number = page["page"]
        text = page["text"]

        start = 0

        while start < len(text):

            end = start + chunk_size

            chunks.append({
                "page": page_number,
                "text": text[start:end]
            })

            start += chunk_size - overlap

    return chunks