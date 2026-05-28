# EduTech Pro — Resumo Inteligente de PDFs com IA

O **EduTech Pro** é uma plataforma que utiliza Inteligência Artificial para facilitar o estudo de documentos complexos. O sistema extrai texto de PDFs, gera resumos estruturados utilizando RAG (Retrieval-Augmented Generation) com o modelo LLaMA 3 e permite ouvir o conteúdo via conversão de texto em áudio.

## Tecnologias Utilizadas

- **Frontend:** React, Tailwind CSS, Lucide React, Axios.
- **Backend:** FastAPI, LangChain, Groq (LLaMA 3), HuggingFace (Embeddings), gTTS.
- **Banco de Dados:** MySQL.

## Como funciona

- O usuário faz upload de um PDF pelo frontend.
- O backend extrai o texto do PDF com `PyPDF2`.
- O texto é dividido em blocos e transformado em embeddings com HuggingFace.
- O vector store FAISS guarda esses embeddings e serve como memória do documento.
- O `ChatGroq` usa o modelo `llama-3.1-8b-instant` para ler o contexto mais relevante e gerar um resumo estruturado.
- O resumo é salvo no banco e o backend também gera um arquivo de áudio com `gTTS`.
- O frontend exibe o resumo, permite ouvir o áudio e listar o histórico de documentos.

## O que cada parte faz

- `edutech-backend/main.py`: recebe upload, extrai texto, gera embeddings, consulta a IA Groq, cria resumo e áudio, e expõe a API.
- `edutech-backend/api.js`: configura o servidor FastAPI, CORS, diretórios de upload e áudio, e define as rotas.
- `edutech-frontend/src/services/api.js`: faz chamadas para o backend para enviar PDF, buscar documentos, carregar resumo e tocar áudio.
- `edutech-frontend/src/App.js`: coordena upload, status, histórico e reprodução de áudio no navegador.
- `edutech-backend/schema.sql`: define a tabela de documentos no MySQL.

## O que a IA Groq faz

- A IA recebe texto já processado e relevante do PDF.
- Ela usa o modelo LLaMA 3 para gerar um resumo educacional, com introdução, pontos-chave e conclusão.
- O backend não envia o PDF inteiro; ele envia apenas os trechos mais relevantes do documento via RAG.

## Pré-requisitos

- ### Python 3.11 até 3.12 
- Node.js & npm
- MySQL Server
- Chave de API do [Groq] (https://console.groq.com/)

##  Configuração do Projeto

### 1. Banco de Dados
Configuração e Execução do Banco de Dados MySQL


Antes de executar o script SQL, verifique se o serviço do MySQL está em execução.

---

## Windows

### Verificar se o MySQL está ativo

Abra o **Prompt de Comando** e execute:

```bash
sc query MySQL80
```

Se aparecer:

```text
STATE              : 4  RUNNING
```

o MySQL está ativo.

---

### Iniciar o MySQL caso esteja parado

```bash
net start MySQL80
```

> O nome do serviço pode variar dependendo da versão instalada.

---

### Executar o script SQL

Localize o arquivo `mysql.exe`, normalmente em:

```text
C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
```

Depois, execute no terminal:

```bash
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u seu_usuario -p < edutech-backend/schema.sql
```

Digite sua senha quando solicitado.

---

## Linux

### Verificar se o MySQL está ativo

```bash
sudo systemctl status mysql
```

Se estiver ativo, aparecerá algo como:

```text
Active: active (running)
```

---

### Iniciar o MySQL caso esteja parado

```bash
sudo systemctl start mysql
```

---

### Executar o script SQL

```bash
mysql -u seu_usuario -p < edutech-backend/schema.sql
```

Digite sua senha quando solicitado.

---
### 2. Backend (FastAPI)
Navegue até o diretório do backend:
```bash
cd edutech-backend
```

Crie um ambiente virtual e instale as dependências:
```bash
python -3.11 -m venv venv311
```
Depois digite:
***No Windows:***
``` bash
venv311\Scripts\activate
```
___No Linux/macOS:___
```bash
source venv311/bin/activate
```
Após isso, instale:
```bash
pip install -r requirements.txt
```

Crie um arquivo `.env` na pasta `edutech-backend` com as seguintes variáveis:

Link para API:[Groq] https://console.groq.com/
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
