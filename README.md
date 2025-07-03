# BextTeste - Gerenciador de Tarefas

## Objetivo
Aplicação de gerenciamento de tarefas (Task Management) com Express.js, TypeScript e MongoDB. Permite criar, listar, atualizar e remover tarefas e listas, com autenticação JWT.

---

## Como rodar o projeto

1. Clone o repositório e acesse a pasta.
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure o arquivo `.env` com:
   ```
   MONGO_URI=mongodb://localhost:27017/bext_teste
   PORT=3000
   JWT_SECRET=sua_chave_secreta
   NODE_ENV=development
   ```
4. Inicie o MongoDB (local ou via Docker):
   ```
   docker run -d -p 27017:27017 --name mongo_bext mongo
   ```
5. Rode o projeto em modo dev:
   ```
   npm run dev
   ```
6. Para rodar os testes:
   ```
   npm test
   ```

---

## Documentação das Rotas

### Autenticação
- `POST /api/auth/register`  
  Body: `{ "nome": "Seu Nome", "email": "email@exemplo.com", "senha": "123456" }`
- `POST /api/auth/login`  
  Body: `{ "email": "email@exemplo.com", "senha": "123456" }`

### Listas de Tarefas
- `POST /api/lists`  
  Body: `{ "nome": "Minha Lista" }`  
  (Requer JWT)
- `GET /api/lists`  
  (Requer JWT)
- `PUT /api/lists/:id`  
  Body: `{ "nome": "Novo Nome" }`  
  (Requer JWT)
- `DELETE /api/lists/:id`  
  (Requer JWT)

### Tarefas
- `POST /api/tasks`  
  Body: `{ "titulo": "Minha tarefa", "descricao": "Desc", "status": "pendente", "dataVencimento": "2025-07-10", "lista": "ID_DA_LISTA" }`  
  (Requer JWT)
- `GET /api/tasks?lista=&status=&dataVencimento=`  
  (Requer JWT)
- `PUT /api/tasks/:id`  
  Body: `{ ... }`  
  (Requer JWT)
- `DELETE /api/tasks/:id`  
  (Requer JWT)

---

## Diagramas

### Diagrama de Arquitetura
```mermaid
graph TD
  A[app.ts] --> B[Rotas]
  B --> C[Controllers]
  C --> D[Services]
  D --> E[Repositories/Models]
  B --> F[Middlewares]
  E --> G[(MongoDB)]
  subgraph src/
    A
    B
    C
    D
    E
    F
  end
```

### Diagrama ER
```mermaid
erDiagram
    USER {
      string _id
      string nome
      string email
      string senha
    }
    TASKLIST {
      string _id
      string nome
      string user
    }
    TASK {
      string _id
      string titulo
      string descricao
      string status
      date dataVencimento
      string lista
      string user
    }
    USER ||--o{ TASKLIST : possui
    USER ||--o{ TASK : possui
    TASKLIST ||--o{ TASK : contem
```

### Fluxo de Autenticação
```mermaid
sequenceDiagram
    participant Cliente
    participant API
    participant MongoDB

    Cliente->>API: POST /api/auth/register (nome, email, senha)
    API->>MongoDB: Cria usuário
    API-->>Cliente: Sucesso ou erro

    Cliente->>API: POST /api/auth/login (email, senha)
    API->>MongoDB: Busca usuário e valida senha
    API-->>Cliente: Retorna JWT ou erro

    Cliente->>API: (com JWT) Acessa rotas protegidas
    API->>API: Valida JWT (middleware)
    API->>MongoDB: Executa ação (CRUD)
    API-->>Cliente: Retorna dados ou erro
```

---

## Feedback

> O desenvolvimento deste desafio foi uma ótima oportunidade para praticar arquitetura limpa, autenticação JWT e testes automatizados com Jest/Supertest. A integração entre camadas ficou clara e o uso do MongoDB via Docker facilitou o setup. O desafio é bem completo e realista para o dia a dia de backend.
