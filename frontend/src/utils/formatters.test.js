import { describe, it, expect } from 'vitest'
import {
  formatarCEP,
  formatarData,
  formatarMoeda,
  formatarTipoProduto,
} from './formatters'

/**
 * TESTES: Formatação de CEP
 * Aplica mascara de CEP (XXXXX-XXX), sanitiza entrada removendo pontuações/letras,
 * limita a quantidade de dígitos e previne erros com valores nulos.
 */
describe('formatarCEP', () => {
  it('formata 8 dígitos', () => {
    expect(formatarCEP('01310100')).toBe('01310-100')
  })
  it('remove caracteres não numéricos', () => {
    expect(formatarCEP('01.310-100')).toBe('01310-100')
  })
  it('limita a 9 caracteres', () => {
    expect(formatarCEP('0131010099999')).toBe('01310-100')
  })
  it('lida com valores vazios', () => {
    expect(formatarCEP(null)).toBe('')
    expect(formatarCEP(undefined)).toBe('')
  })
})

/**
 * TESTES: Formatação de Datas
 * Converte strings ISO (com ou sem horário) para o formato brasileiro (dd/mm/aaaa).
 */
describe('formatarData', () => {
  it('converte ISO para dd/mm/aaaa', () => {
    expect(formatarData('2026-03-15T10:30:00')).toBe('15/03/2026')
  })
  it('converte data sem hora', () => {
    expect(formatarData('2026-03-15')).toBe('15/03/2026')
  })
  it('retorna string vazia para valor falsy', () => {
    expect(formatarData('')).toBe('')
    expect(formatarData(null)).toBe('')
  })
})

/**
 * TESTES: Formatação Monetária (BRL)
 * Converte números flutuantes em valores formatados em Reais (R$).
 * Utiliza normalizador para contornar o espaço indivisível (\u00A0) retornado pela API `Intl`.
 */
describe('formatarMoeda', () => {
  const normalizar = (s) => s.replace(/\u00A0/g, ' ')

  it('formata em BRL', () => {
    expect(normalizar(formatarMoeda(1234.5))).toBe('R$ 1.234,50')
  })
  it('trata valores vazios como zero', () => {
    expect(normalizar(formatarMoeda(null))).toBe('R$ 0,00')
    expect(normalizar(formatarMoeda(undefined))).toBe('R$ 0,00')
  })
})

/**
 * TESTES: Dicionário/Tradução de Tipos de Produto
 * Traduz enums do sistema em descrições amigáveis ao usuário final.
 */
describe('formatarTipoProduto', () => {
  it('traduz tipos conhecidos', () => {
    expect(formatarTipoProduto('PRE_LAVADO')).toBe('Pré-Lavado')
    expect(formatarTipoProduto('NAO_LAVADO')).toBe('Não Lavado')
  })
  it('retorna o próprio valor para tipos desconhecidos', () => {
    expect(formatarTipoProduto('OUTRO')).toBe('OUTRO')
  })
})