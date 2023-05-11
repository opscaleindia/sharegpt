import logging
import sys
from pathlib import Path
from llama_index import GPTVectorStoreIndex, SimpleDirectoryReader, StorageContext, load_index_from_storage

# logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
# logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

docstore_file = Path("/app/storage/docstore.json")
index_store_file = Path("/app/storage/index_store.json")
vector_store_file = Path("/app/storage/vector_store.json")
if docstore_file.is_file() and index_store_file.is_file() and vector_store_file.is_file():
	print("Loading from storage")
	# rebuild storage context
	storage_context = StorageContext.from_defaults(persist_dir="./storage")
	# load index
	index = load_index_from_storage(storage_context)
else:
	print("Building index")
	documents = SimpleDirectoryReader('data').load_data()
	index = GPTVectorStoreIndex.from_documents(documents)
	index.storage_context.persist()

query_engine = index.as_query_engine()
response = query_engine.query("What did the author do growing up?")
print(response)

