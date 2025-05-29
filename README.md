# Backend-Two

Backend da aplicação Two, focada em casais, construída em Node.js com Express e Sequelize (PostgreSQL).

## Sumário

- [Visão Geral](#visão-geral)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Tecnologias e Dependências](#tecnologias-e-dependências)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints Principais](#endpoints-principais)
- [Observações](#observações)

---

## Visão Geral

Este backend fornece APIs REST para funcionalidades como autenticação, gerenciamento de usuários, memórias (fotos), atividades, planner de casal, ranking, presença, conexão entre usuários, upload de arquivos, verificação de e-mail e redefinição de senha.

## Principais Funcionalidades

- Cadastro e login (incluindo Google OAuth)
- Upload de imagens (Cloudinary)
- Planner compartilhado para casais
- Histórico de presença e ranking
- Atividades e desafios para casais
- Recuperação e verificação de e-mail
- Limitação de requisições e segurança básica

## Tecnologias e Dependências

- **Node.js** & **Express**: Framework principal do backend
- **Sequelize**: ORM para PostgreSQL
- **PostgreSQL**: Banco de dados relacional
- **bcrypt**: Hash de senhas
- **jsonwebtoken**: Autenticação JWT
- **multer**: Upload de arquivos (buffer para Cloudinary)
- **cloudinary**: Armazenamento de imagens
- **nodemailer**: Envio de e-mails (SMTP)
- **google-auth-library**: Login com Google
- **express-rate-limit**: Limitação de requisições
- **dotenv**: Variáveis de ambiente
- **cors**: Middleware CORS
- **helmet**: Segurança HTTP
- **pg** e **pg-hstore**: Driver PostgreSQL

Veja todas as dependências em [`package.json`](./package.json).

## Estrutura de Pastas

```
Backend-Two/
│
├── src/
│   ├── controllers/      # Lógica dos endpoints
│   ├── middlewares/      # Middlewares (auth, CORS, erros, etc)
│   ├── models/           # Models Sequelize
│   ├── routes/           # Rotas Express
│   └── config/           # Configurações (db, cloudinary)
│
├── app.js                # App Express principal
├── server.js             # Inicialização do servidor
├── package.json
└── README.md
```

## Configuração do Ambiente

1. **Clone o repositório**
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` na raiz do projeto com as variáveis necessárias (veja abaixo).
4. Certifique-se de ter um banco PostgreSQL rodando e configurado.

## Scripts Disponíveis

- `npm start` — Inicia o servidor em modo produção
- `npm run dev` — Inicia com nodemon (hot reload para desenvolvimento)

## Variáveis de Ambiente

Exemplo de `.env`:

```
PORT=3000
DATABASE_URL=postgres://usuario:senha@localhost:5432/two
JWT_SECRET=sua_chave_secreta
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=senha_app
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
```

> Em breve será disponibilizado o arquivo do banco de dados

## Endpoints Principais

- `/api/auth` — Registro, login, login Google
- `/api/users` — Perfil, atualização, senha, exclusão
- `/api/memories` — CRUD de memórias (fotos)
- `/api/activities` — Atividades e desafios
- `/api/planner` — Eventos do planner do casal
- `/api/presence` — Histórico de presença
- `/api/ranking` — Ranking dos casais
- `/api/connection` — Conexão entre usuários/casais
- `/api/upload` — Upload de arquivos
- `/api/email-verification` — Verificação de e-mail
- `/api/password-reset` — Recuperação de senha

## Observações

- O backend espera que o banco de dados já esteja criado.
- O Sequelize sincroniza os modelos automaticamente.
- O upload de imagens é feito via Cloudinary.
- O sistema de e-mail usa SMTP do Gmail (recomenda-se usar senha de app).
- O rate limit está configurado para evitar abuso de requisições.

---

**Equipe two**