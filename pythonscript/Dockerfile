FROM python:3.11-slim
WORKDIR /app/mindraw
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
VOLUME ["/app/mindraw/chroma_storage"]
EXPOSE 8000
CMD ["uvicorn","pythonser:app","--host","0.0.0.0","--port","8000"]
