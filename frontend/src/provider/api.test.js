import { describe, it, expect, beforeEach, vi } from 'vitest'
import api, { invalidarTokenCsrf } from './api'

let chamadas

/**
 * HELPER: Adapter Customizado para Interceptar Requisições
 * Emula a resposta de rede do Axios no ambiente de testes sem disparar chamadas reais.
 */
function instalarAdapter(handler) {
  api.defaults.adapter = async (config) => {
    chamadas.push({
      method: (config.method || 'get').toLowerCase(),
      url: config.url,
      headers: config.headers,
    })
    const { status = 200, data = {} } = handler(config)
    const resposta = { data, status, statusText: '', headers: {}, config }
    if (status >= 400) {
      const erro = new Error(`HTTP ${status}`)
      erro.config = config
      erro.response = resposta
      throw erro
    }
    return resposta
  }
}

const csrfOk = { status: 200, data: { token: 'tok-1', headerName: 'X-CSRF-TOKEN' } }

beforeEach(() => {
  chamadas = []
  invalidarTokenCsrf()
})

/**
 * TESTES: Interceptor de Requisição (Segurança CSRF)
 * Valida se métodos mutáveis (POST, PUT, DELETE) solicitam o token CSRF
 * automaticamente e o anexam aos cabeçalhos, enquanto métodos idempotentes (GET) não.
 * Também garante reutilização e desduplicação de chamadas paralelas.
 */
describe('interceptor de requisição (CSRF)', () => {
  it('GET não busca token CSRF', async () => {
    instalarAdapter(() => ({ data: { ok: true } }))
    await api.get('/usuarios/me')
    expect(chamadas).toHaveLength(1)
    expect(chamadas[0].url).toBe('/usuarios/me')
  })

  it('POST busca o token e o envia no header', async () => {
    instalarAdapter((c) => (c.url === '/csrf' ? csrfOk : { data: {} }))
    await api.post('/usuarios', { nome: 'A' })

    expect(chamadas.map((c) => c.url)).toEqual(['/csrf', '/usuarios'])
    expect(chamadas[1].headers.get('X-CSRF-TOKEN')).toBe('tok-1')
  })

  it('reutiliza o token em requisições seguintes', async () => {
    instalarAdapter((c) => (c.url === '/csrf' ? csrfOk : { data: {} }))
    await api.post('/a', {})
    await api.put('/b', {})
    expect(chamadas.filter((c) => c.url === '/csrf')).toHaveLength(1)
  })

  it('deduplica buscas simultâneas de CSRF', async () => {
    instalarAdapter((c) => (c.url === '/csrf' ? csrfOk : { data: {} }))
    await Promise.all([api.post('/a', {}), api.post('/b', {}), api.delete('/c')])
    expect(chamadas.filter((c) => c.url === '/csrf')).toHaveLength(1)
  })

  it('falha se a resposta CSRF for inválida', async () => {
    instalarAdapter(() => ({ data: {} }))
    await expect(api.post('/a', {})).rejects.toThrow('Resposta CSRF inválida')
  })

  it('invalidarTokenCsrf força nova busca', async () => {
    instalarAdapter((c) => (c.url === '/csrf' ? csrfOk : { data: {} }))
    await api.post('/a', {})
    invalidarTokenCsrf()
    await api.post('/b', {})
    expect(chamadas.filter((c) => c.url === '/csrf')).toHaveLength(2)
  })
})

/**
 * TESTES: Interceptor de Resposta (Sessão do Usuário)
 * Trata respostas de erro do backend:
 * - Emite o evento global `sessao-expirada` em casos de erro 401 (Não Autorizado).
 * - Ignora o evento caso a rota seja a de login ou se a flag `ignorarEventoSessao` for passada.
 * - Força atualização de token CSRF caso o servidor responda com erro 403 (Proibido).
 */
describe('interceptor de resposta', () => {
  it('401 em rota comum dispara "sessao-expirada"', async () => {
    const ouvinte = vi.fn()
    window.addEventListener('sessao-expirada', ouvinte)
    instalarAdapter(() => ({ status: 401 }))

    await expect(api.get('/pedidos')).rejects.toBeDefined()
    expect(ouvinte).toHaveBeenCalledTimes(1)
    window.removeEventListener('sessao-expirada', ouvinte)
  })

  it('401 no login NÃO dispara o evento', async () => {
    const ouvinte = vi.fn()
    window.addEventListener('sessao-expirada', ouvinte)
    instalarAdapter((c) => (c.url === '/csrf' ? csrfOk : { status: 401 }))

    await expect(api.post('/usuarios/login', {})).rejects.toBeDefined()
    expect(ouvinte).not.toHaveBeenCalled()
    window.removeEventListener('sessao-expirada', ouvinte)
  })

  it('401 com ignorarEventoSessao NÃO dispara o evento', async () => {
    const ouvinte = vi.fn()
    window.addEventListener('sessao-expirada', ouvinte)
    instalarAdapter(() => ({ status: 401 }))

    await expect(api.get('/usuarios/me', { ignorarEventoSessao: true })).rejects.toBeDefined()
    expect(ouvinte).not.toHaveBeenCalled()
    window.removeEventListener('sessao-expirada', ouvinte)
  })

  it('403 limpa o token para nova busca', async () => {
    let bloquear = true
    instalarAdapter((c) => {
      if (c.url === '/csrf') return csrfOk
      if (bloquear) {
        bloquear = false
        return { status: 403 }
      }
      return { data: {} }
    })

    await expect(api.post('/a', {})).rejects.toBeDefined()
    await api.post('/b', {})
    expect(chamadas.filter((c) => c.url === '/csrf')).toHaveLength(2)
  })
})