# 📡 Documentação da API

Base URL: `http://localhost:4000/api`

## Autenticação

Todas as rotas admin requerem header:
```
Authorization: Bearer <accessToken>
```

### POST /auth/login
```json
{ "username": "admin", "password": "CanadaMedieval2026!" }
```
Resposta:
```json
{
  "admin": { "id": "...", "username": "admin", "role": "OWNER", ... },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### POST /auth/refresh
```json
{ "refreshToken": "eyJ..." }
```

### GET /auth/me
Retorna admin logado.

### POST /auth/change-password
```json
{ "currentPassword": "...", "newPassword": "..." }
```

## Produtos

### GET /products
Público. Query params: `search`, `category`, `sort` (recent|price_asc|price_desc|name), `minPrice`, `maxPrice`, `featured`

### GET /products/featured
Público. Retorna 8 produtos em destaque.

### GET /products/:slug
Público. Incrementa views.

### GET /products/admin/all 🔒
Admin. Lista todos.

### POST /products 🔒
Admin. Multipart com campo `image` (obrigatório).

### PUT /products/:id 🔒
Admin. Multipart opcional.

### DELETE /products/:id 🔒
Admin. Remove produto e imagem do Cloudinary.

## Categorias

### GET /categories
### GET /categories/:slug
### GET /categories/admin/all 🔒
### POST /categories 🔒
### PUT /categories/:id 🔒
### DELETE /categories/:id 🔒

## Atualizações

### GET /updates?search=&page=&limit=
### GET /updates/:slug
### POST /updates 🔒
### PUT /updates/:id 🔒
### DELETE /updates/:id 🔒

## Sugestões

### POST /suggestions (público)
```json
{ "name": "João", "discord": "joao#1234", "title": "...", "description": "..." }
```

### GET /suggestions/admin/all?status= 🔒
### PATCH /suggestions/admin/:id 🔒
```json
{ "status": "APPROVED", "adminNote": "Boa ideia!" }
```
Status: `PENDING | READ | APPROVED | REJECTED | IMPLEMENTED`

### DELETE /suggestions/admin/:id 🔒

## Donos (Owners)

### GET /owners
Público. Enriquece com URLs de skin.

### GET /owners/skin/:nick
Público. Retorna UUID e URLs de skin.

### GET /owners/admin/all 🔒
### POST /owners 🔒 (OWNER)
### PUT /owners/:id 🔒 (OWNER)
### DELETE /owners/:id 🔒 (OWNER)

## Admin (Dashboard + Admins)

### GET /admins/dashboard 🔒
```json
{
  "stats": { "products": 0, "suggestions": 0, "updates": 0, "admins": 0 },
  "extra": { "pendingSuggestions": 0, "owners": 0, "categories": 0 },
  "recent": { "suggestions": [...], "updates": [...] }
}
```

### GET /admins/users 🔒 (OWNER)
### POST /admins/users 🔒 (OWNER)
### PUT /admins/users/:id 🔒 (OWNER)
### DELETE /admins/users/:id 🔒 (OWNER)

## Configurações

### GET /settings (público)
### GET /settings/admin/all 🔒
### PUT /settings/admin/all 🔒
```json
{ "site_name": "Canadá", "discord_url": "...", ... }
```

## Roles

| Role | Permissões |
|------|-----------|
| OWNER | Tudo, inclusive gerenciar admins e donos |
| ADMIN | Produtos, categorias, atualizações, sugestões, configurações |
| STAFF | Criar/editar atualizações e ver sugestões |
