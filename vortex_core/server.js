const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env'), quiet: true })

if (!process.env.JWT_SECRET) {
  console.error('Faltou o JWT_SECRET. Copie o arquivo .env.example para .env e preencha.')
  process.exit(1)
}

const express = require('express')
const cors = require('cors')
const { cfg, opcoesEntrega } = require('./backend/config')
const db = require('./backend/db') // abre (e, se preciso, cria) o banco

const app = express()
const front = cfg().frontUrl

// Endereços do site que podem chamar esta API (CORS_ORIGINS aceita vários, separados por vírgula)
const origens = [front, front.replace('localhost', '127.0.0.1'), ...(process.env.CORS_ORIGINS || '').split(',')]
  .map((o) => o.trim())
  .filter(Boolean)
app.use(cors({ origin: origens }))
app.use(express.json())
app.use((req, res, next) => {
  req.body ||= {} // pedido sem corpo JSON: trata como vazio (e as rotas respondem 400)
  next()
})

// Espera o banco ficar pronto antes de atender qualquer pedido
app.use(async (req, res, next) => {
  await db.pronto
  next()
})

app.get('/', (req, res) => res.json({ ok: true, api: 'Vortex Core' }))

app.get('/api/config', (req, res) => {
  const c = cfg()
  res.json({
    frete_fixo: c.freteFixo,
    frete_gratis_acima: c.freteGratisAcima,
    prazo_dias: c.prazoDias,
    opcoes_entrega: opcoesEntrega(),
  })
})

app.use('/api/auth', require('./backend/routes/auth'))
app.use('/api/produtos', require('./backend/routes/produtos'))
app.use('/api/categorias', require('./backend/routes/categorias'))
app.use('/api/carrinho', require('./backend/routes/carrinho'))
app.use('/api/favoritos', require('./backend/routes/favoritos'))
app.use('/api/endereco', require('./backend/routes/endereco'))
app.use('/api/pedidos', require('./backend/routes/pedidos'))
app.use('/api/pagamentos', require('./backend/routes/pagamentos'))
app.use('/api/contato', require('./backend/routes/contato'))
app.use('/api/admin', require('./backend/routes/admin'))

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }))

// Qualquer erro inesperado cai aqui (o front mostra a tela de erro 500)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ erro: 'Erro interno do servidor.' })
})

// No Vercel o app é exportado; no seu computador ele liga o servidor
module.exports = app
if (require.main === module) {
  const porta = process.env.PORT || 3001
  app.listen(porta, (erro) => {
    if (erro) return console.error(`Não deu para ligar a API na porta ${porta}: ${erro.code} (já tem outro servidor nela?)`)
    console.log(`API da Vortex rodando em http://localhost:${porta}`)
  })
}
