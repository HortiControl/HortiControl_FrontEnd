import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * MOCK DA CAMADA DE API
 * Intercepta chamadas do módulo `api` no Contexto de Autenticação.
 */
vi.mock('../provider/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
  invalidarTokenCsrf: vi.fn(),
}))

import api, { invalidarTokenCsrf } from '../provider/api'
import { AuthProvider, useAuth } from './AuthContext'

/**
 * COMPONENTE DUMMY/HELPER
 * Consome os dados e funções expostas pelo Hook `useAuth` para
 * que o React Testing Library consiga ler e disparar eventos na árvore.
 */
function Consumidor() {
  const { status, usuario, autenticado, carregando, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="usuario">{usuario?.nome ?? 'nenhum'}</span>
      <span data-testid="auth">{String(autenticado)}</span>
      <span data-testid="carregando">{String(carregando)}</span>
      <button onClick={() => login('a@b.com', '12345').catch(() => {})}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  )
}

// Renderiza o componente envelopado pelo Provider
const renderizar = () =>
  render(
    <AuthProvider>
      <Consumidor />
    </AuthProvider>
  )

// Helper para gerar objeto de Erro HTTP mockado
const erroHttp = (status) => Object.assign(new Error('x'), { response: { status } })

beforeEach(() => vi.clearAllMocks())

/**
 * TESTES: Verificação Inicial do AuthProvider
 * Avalia a verificação do estado de sessão do usuário no carregamento inicial da aplicação.
 */
describe('AuthProvider - verificação inicial', () => {
  it('começa verificando e vira autenticado quando /me responde', async () => {
    api.get.mockResolvedValue({ data: { nome: 'Ana' } })
    renderizar()

    expect(screen.getByTestId('status')).toHaveTextContent('verificando')
    expect(screen.getByTestId('carregando')).toHaveTextContent('true')

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('autenticado')
    )
    expect(screen.getByTestId('usuario')).toHaveTextContent('Ana')
    expect(api.get).toHaveBeenCalledWith('/usuarios/me', { ignorarEventoSessao: true })
  })

  it('401 resulta em anônimo', async () => {
    api.get.mockRejectedValue(erroHttp(401))
    renderizar()
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('anonimo')
    )
    expect(screen.getByTestId('auth')).toHaveTextContent('false')
  })

  it('outros erros resultam em status "erro"', async () => {
    api.get.mockRejectedValue(erroHttp(500))
    renderizar()
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('erro')
    )
  })
})

/**
 * TESTES: Ações de Login e Logout e Eventos de Sessão
 * - Login: Envia credenciais, invalida o CSRF antigo e armazena os dados do usuário.
 * - Credenciais Inválidas: Mantém o estado como anônimo.
 * - Logout: Comunica o encerramento da sessão ao backend e reseta o estado local.
 * - "sessao-expirada": Desloga o usuário se o evento customizado for disparado na `window`.
 */
describe('AuthProvider - login/logout', () => {
  it('login: faz POST, invalida CSRF e carrega o usuário', async () => {
    api.get.mockRejectedValueOnce(erroHttp(401)) // Simula verificação inicial vazia
    renderizar()
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('anonimo')
    )

    api.post.mockResolvedValue({})
    api.get.mockResolvedValueOnce({ data: { nome: 'Ana' } })

    await userEvent.click(screen.getByText('login'))

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('autenticado')
    )
    expect(api.post).toHaveBeenCalledWith('/usuarios/login', {
      email: 'a@b.com',
      senha: '12345',
    })
    expect(invalidarTokenCsrf).toHaveBeenCalled()
  })

  it('login com credenciais inválidas mantém o usuário anônimo', async () => {
    api.get.mockRejectedValueOnce(erroHttp(401))
    renderizar()
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('anonimo')
    )

    api.post.mockRejectedValue(erroHttp(401))
    await userEvent.click(screen.getByText('login'))

    expect(screen.getByTestId('status')).toHaveTextContent('anonimo')
    expect(invalidarTokenCsrf).not.toHaveBeenCalled()
  })

  it('logout: só limpa o estado após o backend confirmar', async () => {
    api.get.mockResolvedValue({ data: { nome: 'Ana' } })
    api.post.mockResolvedValue({})
    renderizar()
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('autenticado')
    )

    await userEvent.click(screen.getByText('logout'))

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('anonimo')
    )
    expect(api.post).toHaveBeenCalledWith('/usuarios/logout')
    expect(invalidarTokenCsrf).toHaveBeenCalled()
    expect(screen.getByTestId('usuario')).toHaveTextContent('nenhum')
  })

  it('evento "sessao-expirada" derruba a sessão', async () => {
    api.get.mockResolvedValue({ data: { nome: 'Ana' } })
    renderizar()
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('autenticado')
    )

    act(() => {
      window.dispatchEvent(new Event('sessao-expirada'))
    })

    expect(screen.getByTestId('status')).toHaveTextContent('anonimo')
  })
})

/**
 * TESTES: Validação do Hook `useAuth`
 * Garante o disparo de uma exceção amigável caso o Hook seja utilizado por um
 * componente que esteja fora da árvore do `<AuthProvider>`.
 */
describe('useAuth', () => {
  it('lança erro fora do AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Consumidor />)).toThrow(
      'useAuth precisa estar dentro de <AuthProvider>'
    )
    spy.mockRestore()
  })
})