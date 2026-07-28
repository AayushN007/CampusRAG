from sentence_transformers import SentenceTransformer
import chromadb

model = SentenceTransformer("all-MiniLM-L6-v2")


client = chromadb.PersistentClient(
    path="./chroma_db"
)



def get_collection():

    return client.get_or_create_collection(
        name="campusrag_documents"
    )



def search_documents(query: str, n_results: int = 5):

    collection = get_collection()


    query_embedding = model.encode(
        [query]
    ).tolist()



    results = collection.query(

        query_embeddings=query_embedding,

        n_results=n_results

    )



    relevant_chunks = []



    for document, metadata, distance in zip(

        results["documents"][0],

        results["metadatas"][0],

        results["distances"][0]

    ):


        score = round(
            1 / (1 + distance),
            3
        )


        relevant_chunks.append({

            "text": document,

            "filename": metadata.get(
                "filename",
                "unknown"
            ),

            "page": metadata.get(
                "page",
                "unknown"
            ),

            "preview": document[:200] + "...",

            "score": score

        })



    return relevant_chunks