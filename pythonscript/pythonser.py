from fastapi import FastAPI
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.proxies import WebshareProxyConfig
from groq import Groq
from typing import Dict
from dotenv import load_dotenv
import os
import chromadb
load_dotenv()
USERNAME=os.getenv("YOUTUBE_PROXY_USERNAME")
PASSWORD=os.getenv("YOUTUBE_PROXY_PASSWORD")
GROQ_API=os.getenv("GROQ_API_KEY")
client = Groq(
    api_key=GROQ_API,
)
chroma_client=chromadb.PersistentClient(path="./chroma_storage")
from chromadb.utils import embedding_functions
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="multi-qa-mpnet-base-cos-v1"
)
from pydantic import BaseModel
class Summ(BaseModel):
    summary:str
class Item(BaseModel):
    id:str
class Docs(BaseModel):
    userid:str
    contentid:str
    sum:str
class Question(BaseModel):
    question:str
    userid:str
ytt_api = YouTubeTranscriptApi(
    proxy_config=WebshareProxyConfig(
        proxy_username=USERNAME,
        proxy_password=PASSWORD,
    )
)

app=FastAPI()
@app.post("/getsummary")
def fetchsummary(id:Item):  
    print(id.id)
    if not id.id:
        return
    fetched_transcript=ytt_api.fetch(id.id)
    a=""
    for val in fetched_transcript.snippets:
        a=a+" "+val.text
    a=a[:6000]
    prompt_text = a
    print(prompt_text) 
    newobj=Summ(summary=prompt_text)
    newsum=generatesum(newobj)
    print(newsum)
    return newsum
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
@app.post("/gensum")
def generatesum(summary:Summ):
    chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant that summarizes the given youtube transcript or a tweet or a note provided by the user.Summarize as accurate as possible covering all the important points in 100-120 words maxmimum.Don't add anything extra just give the summary"
        },
        {
            "role": "user",
            "content": summary.summary,
        }
    ],
    model="llama-3.3-70b-versatile",
)

    print(chat_completion.choices[0].message.content)
    return {"transcript":chat_completion.choices[0].message.content}
