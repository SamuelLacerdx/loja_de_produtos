# Vortex Core

Front (React + Vite) e back (Express) na mesma pasta:

- `src/`: o site (React)
- `server.js`: a API (Express)
- `backend/`: rotas, serviços e banco (`backend/db`)
- `api/index.js`: entrada da API no Vercel

## Como rodar

Dentro de `vortex_core`:

```powershell
npm install
copy .env.example .env
```

Preencha o `JWT_SECRET` no `.env`.

**Terminal 1** (API, porta 3001):

```powershell
node .\server.js
```

**Terminal 2** (site):

```powershell
npm run dev
```

Abra http://localhost:5173. As chamadas do site para `/api` são repassadas pelo Vite para a API na porta 3001.

Para apagar e recriar o banco local com os dados de teste: `npm run db:reset`.
