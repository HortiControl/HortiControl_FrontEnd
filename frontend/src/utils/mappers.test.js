import { describe, it, expect } from 'vitest'
import { normalizarResultadosDashboard } from './Dashboard/dashboardMappers'
import { formatarPedidoGerenciamento } from './GerenciamentoPedidos/pedidoGerenciamentoMappers'
import { formatarMercadoDaApi, formatarPedidoDaApi } from './MercadoMappers'
import {
  formatarProdutoDaApi,
  formatarProdutoPreLavado,
  formatarProdutoNaoLavado,
} from './produtoMappers'

/**
 * TESTES: Normalizador do Dashboard
 * Garante resiliência da aplicação definindo fallbacks/valores padrão
 * caso a API responda com dados inválidos, nulos ou com estruturas incorretas.
 */
describe('normalizarResultadosDashboard', () => {
  const padrao = {
    faturamento: 0,
    consumoEmbalagens: { caixa: 0, saco: 0 },
  }

  it('preserva padrões quando resultado é inválido', () => {
    for (const invalido of [null, undefined, [], 'texto', 42]) {
      const r = normalizarResultadosDashboard(invalido, padrao)
      expect(r.faturamento).toBe(0)
      expect(r.consumoEmbalagens).toEqual({ caixa: 0, saco: 0 })
      expect(r.evolucaoFaturamento).toEqual([])
    }
  })

  it('sobrescreve campos retornados e mescla consumoEmbalagens', () => {
    const r = normalizarResultadosDashboard(
      { faturamento: 500, consumoEmbalagens: { caixa: 7 } },
      padrao
    )
    expect(r.faturamento).toBe(500)
    expect(r.consumoEmbalagens).toEqual({ caixa: 7, saco: 0 })
  })

  it('garante listas mesmo quando o backend envia tipo errado', () => {
    const r = normalizarResultadosDashboard(
      {
        evolucaoFaturamento: 'x',
        melhoresClientes: null,
        produtosMaisVendidos: [{ id: 1 }],
        historicoEmbalagens: {},
      },
      padrao
    )
    expect(r.evolucaoFaturamento).toEqual([])
    expect(r.melhoresClientes).toEqual([])
    expect(r.produtosMaisVendidos).toEqual([{ id: 1 }])
    expect(r.historicoEmbalagens).toEqual([])
  })
})

/**
 * TESTES: Mapper de Pedidos para Gerenciamento
 * Valida se as propriedades do pedido e a data (ISO -> BR) são formatadas
 * adequadamente para exibição nas telas de gestão.
 */
describe('formatarPedidoGerenciamento', () => {
  it('formata data e reorganiza mercado', () => {
    const r = formatarPedidoGerenciamento({
      id: 1,
      dataSolicitacao: '2026-03-15T10:00:00',
      valorTotal: 100,
      statusPedido: 'PENDENTE',
      valorPago: 40,
      valorAPagar: 60,
      mercado: { nome: 'Mercado X', tipoMercado: 'NORMAL' },
      itens: [{ id: 1 }],
    })
    expect(r.data).toBe('15/03/2026')
    expect(r.mercado).toEqual({ nome: 'Mercado X', tipo: 'NORMAL' })
    expect(r.itens).toEqual([{ id: 1 }])
  })
})

/**
 * TESTES: Mapper da Entidade Mercado
 * Mapeia os diferentes atributos de tipo vindos do Backend com mecânica de fallback:
 * `tipoMercado` -> `tipo` -> 'NORMAL'.
 */
describe('formatarMercadoDaApi', () => {
  const base = { id: 1, nome: 'M', cep: '01310100', numero: '10' }

  it('usa tipoMercado quando disponível', () => {
    expect(formatarMercadoDaApi({ ...base, tipoMercado: 'REDE' }).tipo).toBe('REDE')
  })
  it('cai para tipo e depois para NORMAL', () => {
    expect(formatarMercadoDaApi({ ...base, tipo: 'X' }).tipo).toBe('X')
    expect(formatarMercadoDaApi(base).tipo).toBe('NORMAL')
  })
})

/**
 * TESTES: Mapper de Pedido da API
 * Testa a tolerancia a falhas tratando a ausência de propriedades
 * como `mercado` e `itens`.
 */
describe('formatarPedidoDaApi', () => {
  it('tolera mercado e itens ausentes', () => {
    const r = formatarPedidoDaApi({ id: 1, dataSolicitacao: '2026-01-01' })
    expect(r.mercado).toEqual({ id: undefined, nome: undefined, tipo: undefined })
    expect(r.itens).toEqual([])
    expect(r.data).toBe('2026-01-01')
  })
  it('mapeia mercado quando presente', () => {
    const r = formatarPedidoDaApi({
      id: 1,
      mercado: { id: 2, nome: 'M', tipoMercado: 'NORMAL' },
      itens: [1],
    })
    expect(r.mercado).toEqual({ id: 2, nome: 'M', tipo: 'NORMAL' })
    expect(r.itens).toEqual([1])
  })
})

/**
 * TESTES: Mappers da Entidade Produto
 * Confirma a padronização dos campos e a injeção do tipo estático
 * de produto (ex: PRE_LAVADO e NAO_LAVADO).
 */
describe('mappers de produto', () => {
  const produto = { id: 1, nome: 'Alface', preco: 3.5, tipoEmbalagem: 'CAIXA', tipoProduto: 'X' }

  it('formatarProdutoDaApi', () => {
    expect(formatarProdutoDaApi(produto)).toEqual({
      id: 1, nome: 'Alface', preco: 3.5, embalagem: 'CAIXA', tipo: 'X',
    })
  })
  it('pré-lavado e não lavado fixam o tipoProduto', () => {
    expect(formatarProdutoPreLavado(produto).tipoProduto).toBe('PRE_LAVADO')
    expect(formatarProdutoNaoLavado(produto).tipoProduto).toBe('NAO_LAVADO')
  })
})