import { Select } from "../Select";

const MERCADO_PLACEHOLDER = "Selecione um mercado";
const OPCAO_INICIAL = "Escolha um mercado...";

export function SelecaoCliente({ mercados, mercadoSelecionado, onSelecionar }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 flex items-center sm:flex-row sm:items-center justify-between gap-4">
      <label className="text-sm font-semibold text-gray-700">
        Selecione o Cliente:
      </label>
      <div className="w-full sm:w-120 h-9">
        <Select
          options={[OPCAO_INICIAL].concat(mercados.map((m) => m.nome))}
          value={
            mercadoSelecionado === MERCADO_PLACEHOLDER
              ? OPCAO_INICIAL
              : mercadoSelecionado
          }
          onChange={(e) => onSelecionar(e.target.value)}
        />
      </div>
    </div>
  );
}
