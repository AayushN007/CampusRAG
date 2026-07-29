import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content