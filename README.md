# EduTech Pro — Resumo Inteligente de PDFs com IA

O **EduTech Pro** é uma plataforma que utiliza Inteligência Artificial para facilitar o estudo de documentos complexos. O sistema extrai texto de PDFs, gera resumos estruturados utilizando RAG (Retrieval-Augmented Generation) com o modelo LLaMA 3 e permite ouvir o conteúdo via conversão de texto em áudio.

## Tecnologias Utilizadas

- **Frontend:** React, Tailwind CSS, Lucide React, Axios.
- **Backend:** FastAPI, LangChain, Groq (LLaMA 3), HuggingFace (Embeddings), gTTS.
- **Banco de Dados:** MySQL.

## Pré-requisitos

- Python 3.10 ou superior
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
python -m venv venv
```
Depois digite:
***No Windows:***
``` bash
venv\Scripts\activate
```
___No Linux/macOS:___
```bash
source venv/bin/activate
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
