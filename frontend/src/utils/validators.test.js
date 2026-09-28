import { describe, it, expect } from 'vitest'
import {
  validarNomeCompleto,
  validarTelefone,
  validarTelefoneCadastro,
  validarEmail,
  validarSenhaForte,
  validarNovaSenha,
} from './validators'

/**
 * TESTES: Validação de Nome Completo
 * Garante que nomes em branco, contendo números ou caracteres especiais/cedilha
 * sejam recusados e apenas nomes válidos (inclusive acentuados) sejam aceitos.
 */
describe('validarNomeCompleto', () => {
  it('rejeita vazio', () => {
    expect(validarNomeCompleto('   ')).toBe('Digite seu nome completo.')
  })
  it('rejeita números', () => {
    expect(validarNomeCompleto('João 123')).toBe('O nome deve conter apenas letras.')
  })
  it('rejeita cedilha (regra atual do código)', () => {
    expect(validarNomeCompleto('Conceição')).toBe('O nome deve conter apenas letras.')
  })
  it('aceita nome com acento', () => {
    expect(validarNomeCompleto('José da Silva')).toBeNull()
  })
})

/**
 * TESTES: Validação Generica/Básica de Telefone
 * Valida formatos genéricos de telefone: aceita valores vazios, dígitos até o limite de 11,
 * e rejeita caracteres alfabéticos ou números acima do limite.
 */
describe('validarTelefone', () => {
  it('aceita vazio', () => expect(validarTelefone('')).toBeNull())
  it('aceita até 11 dígitos', () => expect(validarTelefone('11912345678')).toBeNull())
  it('rejeita letras', () => expect(validarTelefone('11abc')).not.toBeNull())
  it('rejeita mais de 11 dígitos', () => expect(validarTelefone('119123456789')).not.toBeNull())
})

/**
 * TESTES: Validação Estrita de Telefone de Cadastro
 * Verifica a regra de cadastro: opcional (aceita vazio/null), porém se preenchido
 * deve conter EXATAMENTE 10 ou 11 dígitos numéricos (com DDD, sem pontuação).
 */
describe('validarTelefoneCadastro', () => {
  it('aceita vazio/nulo (opcional)', () => {
    expect(validarTelefoneCadastro('')).toBeNull()
    expect(validarTelefoneCadastro(null)).toBeNull()
  })
  it('rejeita não numérico', () => {
    expect(validarTelefoneCadastro('11-9123')).toBe('O telefone deve conter apenas números.')
  })
  it('rejeita tamanho inválido', () => {
    expect(validarTelefoneCadastro('123456789')).toBe('O telefone deve ter 10 ou 11 dígitos.')
    expect(validarTelefoneCadastro('123456789012')).toBe('O telefone deve ter 10 ou 11 dígitos.')
  })
  it('aceita 10 e 11 dígitos', () => {
    expect(validarTelefoneCadastro('1132345678')).toBeNull()
    expect(validarTelefoneCadastro('11912345678')).toBeNull()
  })
})

/**
 * TESTES: Validação de E-mail
 * Confirma se o campo é obrigatório e testa diversos padrões inválidos
 * de estrutura de e-mail usando `it.each`.
 */
describe('validarEmail', () => {
  it('rejeita vazio', () => expect(validarEmail('  ')).toBe('Digite um e-mail.'))
  it.each(['semarroba.com', 'a@semponto', '@x.com', 'a@b.', 'a.b@'])(
    'rejeita "%s"',
    (email) => expect(validarEmail(email)).toBe('Digite um e-mail válido.')
  )
  it('aceita e-mail válido', () => expect(validarEmail('a@b.com')).toBeNull())
})

/**
 * TESTES: Validação de Senha Forte
 * Confirma o tamanho mínimo (5 caracteres), proíbe o uso de símbolos especiais
 * e aceita apenas senhas alfanuméricas.
 */
describe('validarSenhaForte', () => {
  it('rejeita menos de 5 caracteres', () => {
    expect(validarSenhaForte('abc1')).toBe('A senha deve ter no mínimo 5 caracteres.')
  })
  it('rejeita caracteres especiais', () => {
    expect(validarSenhaForte('abc123!')).toBe('A senha não pode conter caracteres especiais.')
  })
  it('aceita senha alfanumérica', () => expect(validarSenhaForte('abc12')).toBeNull())
})

/**
 * TESTES: Validação de Alteração/Confirmação de Senha
 * Garante que a nova senha e a confirmação sejam idênticas e que as regras de
 * força de senha continuem sendo respeitadas.
 */
describe('validarNovaSenha', () => {
  it('rejeita confirmação diferente', () => {
    expect(validarNovaSenha('abc12', 'abc13')).toBe('A nova senha e a confirmação não batem.')
  })
  it('delega a validação de força', () => {
    expect(validarNovaSenha('ab', 'ab')).toBe('A senha deve ter no mínimo 5 caracteres.')
  })
  it('aceita senhas iguais e válidas', () => {
    expect(validarNovaSenha('abc12', 'abc12')).toBeNull()
  })
})