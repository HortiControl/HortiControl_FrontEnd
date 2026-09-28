import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * MOCK GLOBAL DA API (AXIOS)
 * Substitui o cliente original por métodos espiões (vi.fn()) para
 * evitar chamadas reais à rede durante a suíte de testes.
 */
vi.mock('../provider/api', () => ({
  default: { post: vi.fn(), put: vi.fn() },
}))

import api from '../provider/api'
import { criarUsuario, atualizarPerfil, atualizarSenha } from './usuariosService'

// Reseta o histórico e retornos dos mocks antes de cada teste
beforeEach(() => vi.clearAllMocks())

/**
 * TESTES: Camada de Serviços de Usuário
 * Verifica as rotas endpoint, verbos HTTP (POST/PUT), payloads enviados e
 * o tratamento da rejeição/propagação de erros da API.
 */
describe('usuariosService', () => {
  it('criarUsuario faz POST e retorna response.data', async () => {
    api.post.mockResolvedValue({ data: { id: 1 } })
    const r = await criarUsuario({ nome: 'A' })
    expect(api.post).toHaveBeenCalledWith('/usuarios', { nome: 'A' })
    expect(r).toEqual({ id: 1 })
  })

  it('atualizarPerfil faz PUT em /usuarios/me/perfil', async () => {
    api.put.mockResolvedValue({ data: { ok: true } })
    const r = await atualizarPerfil({ nome: 'B' })
    expect(api.put).toHaveBeenCalledWith('/usuarios/me/perfil', { nome: 'B' })
    expect(r).toEqual({ ok: true })
  })

  it('atualizarSenha faz PUT em /usuarios/me/senha', async () => {
    api.put.mockResolvedValue({ data: {} })
    await atualizarSenha({ senhaAtual: 'a', novaSenha: 'b' })
    expect(api.put).toHaveBeenCalledWith('/usuarios/me/senha', {
      senhaAtual: 'a',
      novaSenha: 'b',
    })
  })

  it('propaga erros da API', async () => {
    const erro = new Error('falhou')
    api.post.mockRejectedValue(erro)
    await expect(criarUsuario({})).rejects.toBe(erro)
  })
})