# 🏛️ Arquitetura do Sistema

## Visão Geral

Aplicação full-stack com separação clara entre frontend (Next.js) e backend (Express + Prisma). O frontend é desacoplado, consumindo a API via HTTP.

```
┌─────────────────────────────────────────────────────────────┐
│                       USUÁRIOS                              │
└───────────────┬─────────────────────────┬───────────────────┘
                │                         │
        ┌───────▼─────────┐       ┌───────▼─────────┐
        │  Site Público   │       │  Painel Admin   │
        │   (Next.js)     │       │   (Next.js)     │
        │  /, /catalogo,  │       │  /admin/*       │
        │  /atualizacoes, │       │  JWT Auth       │
        │  /equipe, etc.  │       │                 │
        └───────┬─────────┘       └───────┬─────────┘
                │                         │
                │      HTTP/JSON (Axios)  │
                └────────────┬────────────┘
                             │
                    ┌────────▼─────────┐
                    │  Backend Express │
                    │   (Node.js)      │
                    │   REST API       │
                    │  Helmet + CORS   │
                    │  Rate Limit      │
                    │  JWT + Bcrypt    │
                    └────────┬─────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
        ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
        │  Prisma ORM  │ │Storage │ │ Minecraft  │
        │              │ │  (Cld/  │ │  Skin APIs │
        │              │ │  Supa)  │ │ (Crafatar) │
        └───────┬──────┘ └────────┘ └────────────┘
                │
        ┌───────▼──────┐
        │  PostgreSQL  │
        │  (Database)  │
        └──────────────┘
```

## Fluxo de Dados em Tempo Real

Quando o admin adiciona um produto:

1. POST /api/products (com FormData + JWT)
2. Backend: valida → upload imagem Cloudinary → INSERT no PostgreSQL via Prisma
3. Próxima requisição do frontend já retorna o novo produto (React Query invalida cache)
4. Visitantes veem imediatamente sem rebuild

A invalidação de cache é feita via:
- `staleTime: 60_000` (1 min) no React Query → refetch automático
- Manual via `qc.invalidateQueries()` após mutations

## Camadas do Backend

```
backend/src/
├── server.ts          # Bootstrap + Prisma connect
├── app.ts             # Express app, middlewares, rotas
├── lib/
│   ├── prisma.ts      # Singleton do Prisma Client
│   ├── env.ts         # Validação de env
│   ├── storage.ts     # Cloudinary upload
│   └── skin.ts        # Integração Minecraft skin APIs
├── middlewares/
│   ├── auth.ts        # JWT + role-based access
│   └── error.ts       # Error handler global
├── controllers/       # Lógica de negócio
└── routes/            # Definição de rotas + validação
```

## Camadas do Frontend

```
frontend/src/
├── app/               # App Router (RSC + Client)
│   ├── (público)      # Páginas com Navbar/Footer
│   ├── admin/         # Painel protegido
│   └── api/           # (não usado; API está no backend)
├── components/        # UI reutilizável
├── lib/               # Clientes (api, auth, theme)
└── globals.css        # Tailwind + tema medieval
```

## Segurança Implementada

| Camada | Proteção |
|--------|----------|
| Senhas | bcrypt, 12 rounds |
| Auth | JWT access (15min) + refresh (7d) com rotação |
| API | Rate limit 100 req/15min por IP |
| CORS | Origins restritos via env |
| Headers | Helmet (XSS, clickjacking, etc.) |
| Validação | express-validator em todas as rotas |
| SQL | Prisma (queries parametrizadas) |
| XSS | xss-clean + sanitização manual |
| Upload | Validação MIME, limite 8MB |
| Roles | OWNER > ADMIN > STAFF |

## Donos da Loja - Sistema de Skin

A skin do Minecraft é carregada **diretamente da API pública**, sem armazenar imagens:

```typescript
// URLs geradas dinamicamente
const skinUrls = {
  avatar: `https://crafatar.com/avatars/${nick}?size=256&overlay`,
  head:   `https://crafatar.com/renders/head/${nick}?scale=10&overlay`,
  body:   `https://crafatar.com/renders/body/${nick}?scale=6&overlay`,
};
```

Provedores suportados (configurável via `SKIN_API_PROVIDER`):
- **Crafatar** (padrão) - aceita nick direto, cache de UUID via Mojang API
- **Mineatar** - suporta nick direto
- **MC-Heads** - aceita nick direto
- **Minotar** - aceita nick direto

Quando o nick é alterado, a próxima requisição já busca a nova skin automaticamente.
