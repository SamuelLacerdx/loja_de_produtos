
export const API_URL = '' // o front chama /api no mesmo endereço; no dev o Vite repassa para o server.js

export async function api(caminho, { method = 'GET', corpo, formData } = {}) {
  const headers = {}
  const token = localStorage.getItem('vortex_token')
  if (token) headers.Authorization = `Bearer ${token}`
  if (corpo) headers['Content-Type'] = 'application/json'

  const resposta = await fetch(`${API_URL}/api${caminho}`, {
    method,
    headers,
    body: formData ?? (corpo ? JSON.stringify(corpo) : undefined),
  })

  let dados = null
  try {
    dados = await resposta.json()
  } catch {
    /* resposta sem corpo */
  }
  if (!resposta.ok) {
    const erro = new Error(dados?.erro || 'Não foi possível falar com o servidor.')
    erro.status = resposta.status
    throw erro
  }
  return dados
}
