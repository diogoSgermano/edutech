"""
EduTech Pro - Backend API
FastAPI + LangChain + Groq + HuggingFace
"""

import os
import uuid
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from dotenv import load_dotenv

import PyPDF2
from gtts import gTTS

from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

from database import engine, SessionLocal
from models import Base, Document

# ── Carrega variáveis de ambiente ─────────────────────────────────────────────
load_dotenv()

# ── Inicialização ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="EduTech Pro API",
    description="API para resumo inteligente de PDFs com IA",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cria tabelas no banco
Base.metadata.create_all(bind=engine)

# Diretórios de armazenamento
UPLOAD_DIR = Path("uploads")
AUDIO_DIR  = Path("audio")
UPLOAD_DIR.mkdir(exist_ok=True)
AUDIO_DIR.mkdir(exist_ok=True)


# ── Dependência de sessão do banco ────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Utilitários ───────────────────────────────────────────────────────────────
def extract_text_from_pdf(pdf_path: str) -> str:
    """Extrai todo o texto de um arquivo PDF."""
    text = ""
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text


def summarize_with_rag(text: str) -> str:
    """
    Gera um resumo estruturado usando RAG (Retrieval-Augmented Generation).
    - Divide o texto em chunks
    - Cria embeddings com HuggingFace (sentence-transformers)
    - Armazena em índice FAISS
    - Consulta via LangChain + Groq (LLaMA 3)
    """

    # 1. Divisão do texto em chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", " "],
    )
    chunks = splitter.split_text(text)

    # 2. Embeddings com HuggingFace
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={"device": "cpu"},
    )

    # 3. Índice vetorial FAISS
    vectorstore = FAISS.from_texts(chunks, embeddings)

    # 4. LLM via Groq
    # Altere para:
    llm = ChatGroq(
        model_name="llama-3.1-8b-instant",
        groq_api_key=os.getenv("GROQ_API_KEY")
    )


    # 5. Prompt educacional em português
    prompt_template = """Você é um assistente educacional especializado em criar resumos claros e didáticos.
Use o contexto fornecido para criar um resumo estruturado e detalhado do documento.

O resumo deve conter:
- Introdução com o tema principal
- Pontos-chave e conceitos fundamentais
- Conclusão ou considerações finais

Contexto do documento:
{context}

Instrução: {question}

Resumo educacional estruturado:"""

    PROMPT = PromptTemplate(
        template=prompt_template,
        input_variables=["context", "question"],
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
        chain_type_kwargs={"prompt": PROMPT},
    )

    resultado = qa_chain.invoke({
        "query": (
            "Crie um resumo completo, estruturado e educacional de todo o conteúdo "
            "deste documento, destacando os pontos principais, conceitos-chave e conclusões."
        )
    })

    return resultado["result"]


# ── Rotas ──────────────────────────────────────────────────────────────────────

@app.get("/", tags=["health"])
def root():
    return {"message": "EduTech Pro API está online!", "version": "1.0.0"}


@app.post("/upload", tags=["pdf"])
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Recebe um PDF, extrai o texto, gera um resumo via RAG e salva no banco.
    Retorna: id, file_id, filename, summary
    """
    # Valida extensão
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Apenas arquivos PDF são permitidos.")

    # Salva o arquivo
    file_id   = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}.pdf"

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Extrai texto
    texto = extract_text_from_pdf(str(file_path))
    if not texto.strip():
        raise HTTPException(
            status_code=422,
            detail="Não foi possível extrair texto do PDF. Verifique se o arquivo não está protegido.",
        )

    # Gera resumo com RAG
    resumo = summarize_with_rag(texto)

    # Persiste no banco
    doc = Document(file_id=file_id, filename=file.filename, summary=resumo)
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "id":       doc.id,
        "file_id":  file_id,
        "filename": file.filename,
        "summary":  resumo,
    }


@app.get("/audio/{file_id}", tags=["audio"])
async def get_audio(file_id: str, db: Session = Depends(get_db)):
    """
    Gera (ou retorna cacheado) o áudio MP3 do resumo de um documento.
    Usa gTTS para síntese de voz em português.
    """
    doc = db.query(Document).filter(Document.file_id == file_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documento não encontrado.")

    audio_path = AUDIO_DIR / f"{file_id}.mp3"

    # Gera o áudio apenas se ainda não existir (cache)
    if not audio_path.exists():
        tts = gTTS(text=doc.summary, lang="pt", slow=False)
        tts.save(str(audio_path))

    return FileResponse(
        path=str(audio_path),
        media_type="audio/mpeg",
        filename=f"resumo_{doc.filename}.mp3",
    )


@app.get("/documents", tags=["documents"])
def list_documents(db: Session = Depends(get_db)):
    """Lista todos os documentos processados (mais recentes primeiro)."""
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return [
        {
            "id":         d.id,
            "filename":   d.filename,
            "file_id":    d.file_id,
            "created_at": str(d.created_at),
        }
        for d in docs
    ]


@app.get("/documents/{doc_id}", tags=["documents"])
def get_document(doc_id: int, db: Session = Depends(get_db)):
    """Retorna os detalhes completos (incluindo resumo) de um documento."""
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documento não encontrado.")

    return {
        "id":         doc.id,
        "filename":   doc.filename,
        "file_id":    doc.file_id,
        "summary":    doc.summary,
        "created_at": str(doc.created_at),
    }


@app.delete("/documents/{doc_id}", tags=["documents"])
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    """Remove um documento e seus arquivos associados."""
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documento não encontrado.")

    # Remove arquivos físicos
    pdf_path   = UPLOAD_DIR / f"{doc.file_id}.pdf"
    audio_path = AUDIO_DIR  / f"{doc.file_id}.mp3"

    for path in [pdf_path, audio_path]:
        if path.exists():
            path.unlink()

    db.delete(doc)
    db.commit()

    return {"message": "Documento removido com sucesso."}
