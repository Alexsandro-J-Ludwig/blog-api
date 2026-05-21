# BlogU - Back-end 🚀

Esse é o repositório back-end da plataforma **BlogU**, onde os usuários podem criar, editar, excluir e curtir posts de outros usuários. Além de poderem realizar edição e exclusão do próprio perfil e realizar login e cadastro.


## Tecnologias utilizadas 💻

- [NestJS](https://nestjs.com/) - O framework web para Node.js.
- [TypeORM](https://typeorm.io/) - Um ORM para TypeScript e JavaScript.
- [PostgreSQL](https://www.postgresql.org/) - Um banco de dados relacional.
- [JWT](https://jwt.io/) - Um padrão aberto para criação de tokens de acesso.
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Uma biblioteca para hashing de senhas.


## Funcionalidades Principais

- Cadastro, login e edição de perfil
- Criação, edição e exclusão de posts
- Curtir posts
- Listar posts de um usuário específico
- Listar todos os posts


## 📂 Estrutura do Projeto

```
src/
├── post/
|   ├── post.controller.ts       # Controller dos posts
|   ├── post.module.ts           # Module dos posts
|   ├── post.service.ts          # Service dos posts
|   └── post.entity.ts           # Entity dos posts
├── user/
|   ├── user.controller.ts       # Controller dos usuários
|   ├── user.module.ts           # Module dos usuários
|   ├── user.service.ts          # Service dos usuários
|   └── user.entity.ts           # Entity dos usuários
├── api.spec.ts                  # Testes de integração dos endpoints
├── main.ts                      # Arquivo principal da aplicação
├── app.module.ts                # Module principal da aplicação
└── seed.ts                      # Script para popular o banco de dados
```

## Endpoints da API

A documentação completa dos endpoints pode ser encontrada na documentação do Swagger.
http://localhost:3000/api


## Como instalar

1. Clone o projeto com ```git clone https://github.com/Alexsandro-J-Ludwig/blog-api.git```
2. Entre no diretório do projeto com ```cd blog-api```
3. Instale as dependências com ```npm install```
4. Crie um banco de dados no PostgreSQL (pode ser conectado via URL ou entrada de dados do banco)
5. Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
```env
DATABASE_URL="postgresql://postgres:<senha_do_banco>@localhost:<porta>/<nome_do_banco>" 
ou
DB_HOST="<host>"
DB_PORT="<port>"
DB_USER="<user>"
DB_PASSWORD="<password>"
DB_NAME="<database>"

JWT_SECRET="<jwt_secret>"
```
6. Compile o projeto com ```npm run build```
7. Execute o seed para popular o banco de dados com ```node dist/seed.js```
8. Execute o projeto com ```npx nest start```


