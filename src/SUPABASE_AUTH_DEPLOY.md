# Supabase + Auth + Deploy

## Variaveis da API

Crie/atualize o `.env` na raiz do projeto, junto ao `package.json`.

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

Tambem pode usar uma connection string:

```env
DATABASE_URL=postgresql://postgres:SUA_PASSWORD_URL_ENCODED@db.xwnkbpluxftynawtajay.supabase.co:5432/postgres
DB_SSL=true
```

Se a password tiver caracteres como `&`, `%` ou `@`, eles precisam estar codificados na `DATABASE_URL`.

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

## Supabase no deploy

O endpoint direto `db.xwnkbpluxftynawtajay.supabase.co:5432` pode exigir rede IPv6 no servidor. Se o deploy nao conseguir conectar, use a connection string do Supabase em modo pooler session, disponivel no dashboard em `Connect`.
