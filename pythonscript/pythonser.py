from fastapi import FastAPI
from youtube_transcript_api import YouTubeTranscriptApi
from transformers import pipeline
from typing import Dict
import chromadb
chroma_client=chromadb.PersistentClient(path="./chroma_storage")
from chromadb.utils import embedding_functions
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="multi-qa-mpnet-base-cos-v1"
)
from pydantic import BaseModel
class Item(BaseModel):
    id:str
class Docs(BaseModel):
    userid:str
    contentid:str
    sum:str
class Question(BaseModel):
    question:str
    userid:str
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
yttapi=YouTubeTranscriptApi()
app=FastAPI()
@app.post("/getsummary")
def fetchsummary(id:Item):  
    print(id.id)
    if not id.id:
        return
    fetched_transcript=yttapi.fetch(id.id)
    a=""
    for val in fetched_transcript.snippets:
        a=a+" "+val.text
    a=a[:4000]
    prompt_text = a
    print(prompt_text) 
    return {"transcript":summarizer(prompt_text,max_length=200,min_length=50,do_sample=False)}
@app.post("/insertdoc")
def insertdoc(fulldoc:Docs):
    collection=chroma_client.get_or_create_collection(name="mycollection",embedding_function=sentence_transformer_ef)
    collection.add(documents=[fulldoc.sum],ids=[fulldoc.contentid],metadatas=[{"userid":fulldoc.userid}])
    return {"insertion":"succeded"}
@app.post("/question")
def closestdoc(question:Question):
    collection=chroma_client.get_collection(name="mycollection")
    results=collection.query(query_texts=[question.question],n_results=3,where={"userid":question.userid})
    finalresult={"documents":[],"distances":[],"ids":[]}
    for doc,dist,ids in zip(results['documents'][0],results['distances'][0],results['ids'][0]):
        if dist<1.5:
            finalresult["documents"].append(doc)
            finalresult["distances"].append(dist)
            finalresult["ids"].append(ids)
    print(finalresult)
    return finalresult
@app.delete("/deletedoc")
def deletepost(contentid:Item):
    collection=chroma_client.get_collection(name="mycollection")
    collection.delete(ids=[contentid.id])
    return {"deletion":"successful"}
@app.put("/updatedoc")
def updatepost(contentid:Docs):
    collection=chroma_client.get_collection(name="mycollection")
    collection.add(ids=[contentid.contentid],documents=[contentid.sum],metadatas=[{"userid":contentid.userid}])
    return {"updation":"succeeded"}