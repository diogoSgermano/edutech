# EduTech Pro — Resumo Inteligente de PDFs com IA

O **EduTech Pro** é uma plataforma que utiliza Inteligência Artificial para facilitar o estudo de documentos complexos. O sistema extrai texto de PDFs, gera resumos estruturados utilizando RAG (Retrieval-Augmented Generation) com o modelo LLaMA 3 e permite ouvir o conteúdo via conversão de texto em áudio.

## 🚀 Tecnologias Utilizadas

- **Frontend:** React, Tailwind CSS, Lucide React, Axios.
- **Backend:** FastAPI, LangChain, Groq (LLaMA 3), HuggingFace (Embeddings), gTTS.
- **Banco de Dados:** MySQL.

## 📋 Pré-requisitos

- Python 3.10 ou superior
- Node.js & npm
- MySQL Server
- Chave de API do [Groq](https://console.groq.com/)

## 🔧 Configuração do Projeto

### 1. Banco de Dados
Certifique-se de que o serviço do MySQL está ativo. No terminal ou workbench, execute o script para criar a base de dados e a tabela necessária:

```bash
mysql -u seu_usuario -p < edutech-backend/schema.sql
```

### 2. Backend (FastAPI)
Navegue até o diretório do backend:
```bash
cd edutech-backend
```

Crie um ambiente virtual e instale as dependências:
```bash
python -m venv venv
# No Windows:
venv\Scripts\activate
# No Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

Crie um arquivo `.env` na pasta `edutech-backend` com as seguintes variáveis:
```env
DATABASE_URL=mysql+pymysql://usuario:senha@localhost:3306/edutech_pro
GROQ_API_KEY=sua_chave_do_groq
```

Inicie o servidor:
```bash
uvicorn main:app --reload
```

### 3. Frontend (React)
Abra um novo terminal e navegue até o diretório do frontend:
```bash
cd edutech-frontend
npm install
npm start
```

O sistema estará disponível em `http://localhost:3000`.
