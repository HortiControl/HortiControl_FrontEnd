import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../hooks/Login/useLoginPageState', () => ({
  useLoginPageState: vi.fn(),
}))
vi.mock('../../assets/banner.png', () => ({ default: 'banner.png' }))
vi.mock('../../assets/HortiControlLogo.png', () => ({ default: 'logo.png' }))
vi.mock('../Button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}))

import { useLoginPageState } from '../../hooks/Login/useLoginPageState'
import LoginCard from './LoginCard'

const estadoBase = () => ({
  mostrarSenha: false,
  onAlternarMostrarSenha: vi.fn(),
  enviando: false,
  direcionarCadastro: vi.fn(),
  handleLogin: vi.fn(),
})

let estado

beforeEach(() => {
  estado = estadoBase()
  useLoginPageState.mockReturnValue(estado)
})

describe('LoginCard', () => {
  it('renderiza título, campos e botão', () => {
    render(<LoginCard />)
    expect(screen.getByText('Seja Bem-Vindo!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('exemplo@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('•••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled()
  })

  it('envia e-mail (com trim) e senha ao submeter', async () => {
    const user = userEvent.setup()
    render(<LoginCard />)

    await user.type(screen.getByPlaceholderText('exemplo@email.com'), '  ana@teste.com  ')
    await user.type(screen.getByPlaceholderText('•••••'), 'abc12')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(estado.handleLogin).toHaveBeenCalledTimes(1)
    expect(estado.handleLogin).toHaveBeenCalledWith('ana@teste.com', 'abc12')
  })

  it('campo de senha é "password" por padrão e "text" quando visível', () => {
    const { rerender } = render(<LoginCard />)
    expect(screen.getByPlaceholderText('•••••')).toHaveAttribute('type', 'password')

    useLoginPageState.mockReturnValue({ ...estado, mostrarSenha: true })
    rerender(<LoginCard />)
    expect(screen.getByPlaceholderText('•••••')).toHaveAttribute('type', 'text')
  })

  it('o botão do olho chama onAlternarMostrarSenha', async () => {
    const user = userEvent.setup()
    const { container } = render(<LoginCard />)
    // único button type="button" do formulário
    await user.click(container.querySelector('button[type="button"]'))
    expect(estado.onAlternarMostrarSenha).toHaveBeenCalledTimes(1)
  })

  it('desabilita o botão e mostra "Entrando..." durante o envio', () => {
    useLoginPageState.mockReturnValue({ ...estado, enviando: true })
    render(<LoginCard />)
    const botao = screen.getByRole('button', { name: 'Entrando...' })
    expect(botao).toBeDisabled()
  })

  it('"Cadastre-se" chama direcionarCadastro', async () => {
    const user = userEvent.setup()
    render(<LoginCard />)
    await user.click(screen.getByText('Cadastre-se'))
    expect(estado.direcionarCadastro).toHaveBeenCalledTimes(1)
  })
})