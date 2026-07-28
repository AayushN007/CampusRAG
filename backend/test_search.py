from app.services.search_service import search_documents


query = "What is the main idea of the book?"

results = search_documents(query)

print("Number of results:", len(results))

for i, result in enumerate(results):
    print("\n--- Result", i + 1, "---")
    print(result[:500])