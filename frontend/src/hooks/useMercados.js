import { useCallback, useEffect, useState } from "react";
import {
  listarMercados,
  criarMercado,
  atualizarMercado,
  excluirMercado,
} from "../services/mercadosService";
import { formatarMercadoDaApi } from "../utils/mercadoMappers";
import { useNotification } from "../components/notifications/NotificationContext";

/** Regra de negócio da listagem/CRUD de clientes (mercados). */
export function useMercados() {
  const notify = useNotification();
  const [mercadosData, setMercadosData] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState("TODOS");

  const carregarMercados = useCallback(() => {
    listarMercados()
      .then((data) => {
        const mercadosFormatados = (data || [])
          .map(formatarMercadoDaApi)
          .sort((a, b) => a.nome.localeCompare(b.nome));
        setMercadosData(mercadosFormatados);
      })
      .catch((error) => {
        console.error("Erro ao carregar clientes:", error);
        setMercadosData([]);
        notify.error(
          "Não foi possível carregar os clientes. Tente novamente mais tarde.",
        );
      });
  }, [notify]);

  useEffect(() => {
    carregarMercados();
  }, [carregarMercados]);

  const salvarMercado = async (dados, mercadoId = null) => {
    const dadosDoForms = {
      nome: dados.nome,
      tipoMercado: dados.tipo,
      cep: dados.cep,
      numero: dados.numero,
    };

    try {
      if (mercadoId) {
        await atualizarMercado(mercadoId, dadosDoForms);
      } else {
        await criarMercado(dadosDoForms);
      }
      carregarMercados();
      return true;
    } catch {
      notify.error(
        "Não foi possível salvar o cliente. Verifique os dados e tente novamente.",
      );
      return false;
    }
  };

  const removerMercado = async (mercadoId) => {
    try {
      await excluirMercado(mercadoId);
      setMercadosData((prev) =>
        prev.filter((mercado) => mercado.id !== mercadoId),
      );
      notify.success("Cliente excluído com sucesso.");
      return true;
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      notify.warning(
        "Não foi possível excluir. Este cliente pode ter pedidos vinculados.",
      );
      return false;
    }
  };

  const mercadosFiltrados = mercadosData.filter((mercado) => {
    if (filtroAtivo === "TODOS") return true;
    return mercado.tipo.toUpperCase() === filtroAtivo;
  });

  return {
    mercadosFiltrados,
    filtroAtivo,
    setFiltroAtivo,
    salvarMercado,
    removerMercado,
  };
}
