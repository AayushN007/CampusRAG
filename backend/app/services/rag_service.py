from app.services.search_service import search_documents
from app.services.llm_service import generate_answer



def ask_rag(question: str):

    relevant_chunks = search_documents(
        question
    )


    if not relevant_chunks:

        return {

            "question": question,

            "answer": "I could not find the answer in the document.",

            "sources": []

        }



    context = ""


    for chunk in relevant_chunks:

        context += f"""

Document: {chunk['filename']}

Page: {chunk['page']}

Content:
{chunk['text']}

"""



    answer = generate_answer(
        question,
        context
    )



    sources = [

        {

            "filename": chunk["filename"],

            "page": chunk["page"],

            "preview": chunk["preview"],

            "score": chunk["score"]

        }

        for chunk in relevant_chunks

    ]



    return {

        "question": question,

        "answer": answer,

        "sources": sources

    }