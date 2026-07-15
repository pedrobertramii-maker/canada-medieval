# 🏰 Canadá Medieval - Loja Minecraft

> Site oficial do reino medieval **Canadá** dentro de um servidor de Minecraft.

Aplicação full-stack completa com painel administrativo, catálogo dinâmico, sistema de atualizações, sugestões, equipe com skins reais do Minecraft e tema medieval premium.

---

## 🎨 Identidade Visual

- Medieval, elegante, profissional, premium
- Inspirado em Minecraft, sem aparência infantil
- Madeira escura, pedra, ferro, detalhes dourados
- Folhas, tochas, banners, folha de maple canadense
- Dark Mode nativo

---

## 🧱 Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **TailwindCSS** com tema customizado medieval
- **Framer Motion** para animações elegantes
- **Zustand** para estado global (tema, auth)
- **Axios** para HTTP
- **Lucide Icons** + ícones custom SVG

### Backend
- **Node.js 20** + **Express**
- **TypeScript**
- **Prisma ORM** + **PostgreSQL**
- **JWT** (access + refresh) com hash bcrypt
- **Multer** para uploads
- **Cloudinary** (ou Supabase Storage) para imagens
- **Helmet**, **CORS**, **express-rate-limit**, **express-validator**, **xss-clean**

### Segurança
- Sanitização contra XSS
- Validação completa de formulários
- Hash de senha (bcrypt, 12 rounds)
- JWT com rotação
- Rate limit por IP
- Rotas protegidas por role (OWNER, ADMIN, STAFF)
- Prisma (proteção contra SQL Injection por padrão)

---

## 📂 Estrutura

```
canada-medieval/
├── frontend/         # Next.js (App Router)
│   ├── src/app/      # Páginas públicas + admin
│   ├── src/components/
│   ├── src/lib/
│   └── public/
└── backend/          # Express + Prisma
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── middlewares/
    │   └── lib/
    └── prisma/
```

---

## ⚙️ Setup

### 1. Pré-requisitos
- Node.js 20+
- PostgreSQL 15+
- Conta no Cloudinary (ou Supabase)

### 2. Backend
```bash
cd backend
cp .env.example .env      # editar com suas credenciais
npm install
npx prisma migrate dev
npm run seed              # cria admin master + donos + dados iniciais
npm run dev
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Acesse: `http://localhost:3000`

---

## 👑 Donos Iniciais (seed)

- **Ketelez** — Fundador
- **Gord1n** — Co-Fundador

A skin é buscada automaticamente via API pública (Crafatar/Mineatar/MCHeads).

---

## 🔐 Admin Padrão (após seed)

| Campo    | Valor                  |
|----------|------------------------|
| Usuário  | `admin`                |
| Senha    | `CanadaMedieval2026!`  |
| Role     | `OWNER`                |

**⚠️ Troque imediatamente após o primeiro login.**

---

## 📜 Funcionalidades

- ✅ Home com hero medieval animado
- ✅ Catálogo dinâmico (carregado do banco)
- ✅ Categorias, pesquisa e filtros
- ✅ Página de Atualizações (posts do admin)
- ✅ Sistema de Sugestões público
- ✅ Página "Equipe" com skins reais do Minecraft (avatar + 3D)
- ✅ Painel admin completo (Dashboard, Produtos, Categorias, Atualizações, Sugestões, Donos, Configurações)
- ✅ Upload de imagens (Cloudinary/Supabase)
- ✅ Dark Mode persistente
- ✅ SEO completo, lazy loading, compressão
- ✅ 404 personalizada, loading screen medieval
- ✅ Partículas discretas, efeitos sonoros opcionais
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Atualização em tempo real sem rebuild

---

## 📖 Documentação

Veja a pasta `docs/` para:
- Arquitetura detalhada
- Endpoints da API
- Modelos do banco
- Guia de deploy
