import ollama


def generate_answer(question: str, context: str) -> str:

    prompt = f"""
You are answering questions from a book.

Use the context below.

If the exact answer is not available, infer the answer from the available context.

Do not say you cannot find the answer unless there is absolutely no useful information.

Context:
{context}

Question:
{question}

Answer:
"""


    response = ollama.chat(
        model="llama3.1",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]