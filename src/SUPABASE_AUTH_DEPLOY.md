# Supabase + Auth + Deploy

## Variaveis da API

Para desenvolvimento local, crie/atualize o `.env` na raiz do projeto, junto ao `package.json`.
Nao envie o `.env` para o Git. Use `.env.example` como modelo.

```env
PORT=3000
NODE_ENV=development

DB_HOST=db.xwnkbpluxftynawtajay.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=SUA_PASSWORD_SUPABASE
DB_SSL=true

JWT_SECRET=troque-por-uma-chave-grande-e-aleatoria
JWT_EXPIRES_IN_SECONDS=86400
CORS_ORIGIN=http://localhost:5173
```

## Render

No Render, configure as variaveis em `Environment`. Nao crie `.env` no repo.

Use preferencialmente a connection string do Supabase Pooler:

```txt
NODE_ENV=production
DATABASE_URL=postgres://postgres.PROJECT_REF:SUA_PASSWORD@aws-REGION.pooler.supabase.com:5432/postgres
DB_SSL=true
JWT_SECRET=uma-chave-grande-e-aleatoria
CORS_ORIGIN=https://seu-front-end.com
```

O backend da Render pode nao conseguir acessar o endpoint direto `db.PROJECT_REF.supabase.co:5432`
quando ele resolve para IPv6. Nesse caso, copie do dashboard do Supabase a connection string
`Session pooler`, que usa o host `aws-REGION.pooler.supabase.com` e funciona em redes IPv4.

O projeto tambem aceita as variaveis separadas `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e
`DB_PASSWORD`, mas `DATABASE_URL` tem prioridade e e mais simples para deploy.

Se a password tiver caracteres como `&`, `%` ou `@`, eles precisam estar codificados na `DATABASE_URL`.
Ao copiar a string do dashboard do Supabase, normalmente ela ja vem no formato certo ou com o campo
`[YOUR-PASSWORD]` para substituir.

## Endpoints de auth

```txt
POST /auth/register
POST /auth/login
GET  /auth/me
```

Body para register:

```json
{
  "nome": "Admin",
  "email": "admin@email.com",
  "password": "123456"
}
```

Body para login:

```json
{
  "email": "admin@email.com",
  "password": "123456"
}
```

Use o token retornado nas rotas protegidas:

```txt
Authorization: Bearer SEU_TOKEN
```

## Rotas protegidas

As rotas `GET` continuam publicas. As rotas abaixo exigem token:

```txt
POST   /filmes
PUT    /filmes/:id
DELETE /filmes/:id
POST   /generos
PUT    /generos/:id
DELETE /generos/:id
```

## React

No front:

```env
VITE_API_URL=https://sua-api.onrender.com
```

Exemplo com Axios:

```js
axios.post(`${import.meta.env.VITE_API_URL}/filmes`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Checklist de deploy

- Build command no Render: `npm install`
- Start command no Render: `npm start` ou `node index.js`
- Use `DATABASE_URL` do Supabase `Session pooler`
- Configure `NODE_ENV=production`
- Configure `JWT_SECRET`
- Configure `CORS_ORIGIN` com a URL real do frontend
- Nao configure `CORS_ORIGIN=http://localhost:5173` em producao, exceto para testes locais
