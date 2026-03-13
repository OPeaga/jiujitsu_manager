# 🥋 Jiu Jitsu Manager

Um sistema completo de gestão pessoal para praticantes de Jiu Jitsu. Registre suas técnicas aprendidas, cadastre vídeos de estudo, acompanhe seu histórico de faixas (time-series) e contabilize a sua assiduidade nos tatames!

![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-success)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=nodedotjs&logoColor=white)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)

---

## ✨ Funcionalidades

- **Biblioteca de Técnicas:** Cadastre golpes com nomes normais e em japonês, insira links de vídeos (YouTube/Instagram) e anotações pessoais.
- **Controle de Aprendizado:** Marque quais técnicas você já domina e filtre-as facilmente no painel.
- **Histórico de Graduação:** Registre não apenas a sua faixa atual, mas construa uma linha do tempo mostrando quando e a qual grau você foi promovido.
- **Contador de Treinos:** Registre cada ida ao tatame com um clique persistente.
- **Dark/Light Mode:** Interface agradável focada na leitura e no minimalismo (Tailwind CSS), salvando a sua preferência localmente.
- **Documentação Interativa (Swagger):** API 100% documentada com painel interativo embutido no próprio frontend (`/docs`).

---

## 🛠️ Tecnologias Utilizadas

O projeto adota uma arquitetura clássica e independente, separando o cliente (Frontend) do servidor (Backend).

### Frontend
- **React 18** via **Vite** (Rápido e otimizado)
- **React Router DOM** (Navegação SPA)
- **Axios** (Comunicação com a API)
- **Tailwind CSS** (Estilização utilitária e responsiva)
- **Lucide React** (Ícones modernos e minimalistas)

### Backend
- **Node.js** com **Express**
- **SQLite** (Banco de dados local via arquivo, zero configuração)
- **Swagger JSDoc / UI Express** (Para a documentação OpenAPI 3.0)
- **CORS & Dotenv** (Segurança e variáveis de ambiente)
- **Segurança de API Key** (Middleware para proteger as rotas)

---

## 🚀 Como Rodar o Projeto na Sua Máquina

Este projeto não exige banco de dados externo. O banco será criado automaticamente em um arquivo dentro do repositório!

### 1. Clonando o repositório

```bash
git clone https://github.com/OPeaga/jiujitsu_manager.git
cd jiujitsu_manager
```

### 2. Configurando o Backend

Navegue até a pasta do servidor e instale as dependências. Nós possuímos um script especial `dev` que automaticamente cria as tabelas e insere 5 técnicas de exemplo no seu primeiro uso.

```bash
cd backend

# Instale os pacotes
npm install

# Crie o arquivo de configuração
echo "PORT=3001" > .env
echo "API_KEY=BJJ_SECRET_KEY_123" >> .env

# Inicie o servidor (O banco será populado automaticamente!)
npm run dev
```
> O servidor estará escutando em: **`http://localhost:3001`**

### 3. Configurando o Frontend

Abra um novo terminal na raiz do projeto, navegue até a pasta do cliente e o inicie.

```bash
cd frontend

# Instale os pacotes
npm install

# Crie a variável apontando para a mesma chave do backend
echo "VITE_API_KEY=BJJ_SECRET_KEY_123" > .env.local

# Inicie o app
npm run dev
```
> O App estará acessível em: **`http://localhost:3000`**

---

## 📖 Como Usar a Documentação (Swagger)

A API possui rotas protegidas que exigem o envio de um *Header* `x-api-key : BJJ_SECRET_KEY_123`.
Para testar os endpoints interativamente, navegue até a aba **Documentação** dentro do Frontend (`http://localhost:3000/docs`).

Se preferir a visão bruta do Backend, acesse `http://localhost:3001/api-docs`.

---

## 📁 Estrutura de Pastas

```text
jiujitsu_manager/
│
├── backend/                  # API Rest (Node + Express)
│   ├── jiujitsu.sqlite       # (Gerado automaticamente) Banco de Dados
│   ├── scripts/              # Scripts de Migrations e Seeders
│   └── src/
│       ├── lib/              # Conexão com SQLite
│       ├── middleware/       # Autenticação (Auth)
│       ├── routes/           # Endpoints separados (Belt, Techniques, Training)
│       └── server.js         # Entrada da aplicação Backend
│
└── frontend/                 # Cliente (React + Vite)
    └── src/
        ├── api/              # Configuração global do Axios
        ├── components/       # Componentes reaproveitáveis (Navbar, Cards, Modais)
        ├── pages/            # Telas da Aplicação
        └── index.css         # Variáveis de Cores (Themes)
```

---

Feito com 🥋 e 💻 para aprimorar os estudos no tatame.
