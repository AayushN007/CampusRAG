import chromadb
import uuid


client = chromadb.PersistentClient(
    path="./chroma_db"
)


def get_collection():

    return client.get_or_create_collection(
        name="campusrag_documents"
    )



def store_embeddings(chunks, embeddings):

    collection = get_collection()


    ids = []
    documents = []
    metadatas = []



    for chunk, embedding in zip(chunks, embeddings):

        chunk_id = str(uuid.uuid4())


        ids.append(chunk_id)


        documents.append(
            chunk["text"]
        )


        metadatas.append({

            "page": chunk.get(
                "page",
                "unknown"
            ),

            "filename": chunk.get(
                "filename",
                "unknown"
            ),

            "chunk_id": chunk_id

        })



    collection.add(

        ids=ids,

        documents=documents,

        embeddings=embeddings,

        metadatas=metadatas

    )



    return {

        "stored_chunks": len(chunks)

    }