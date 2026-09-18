import { PageHeader } from "../PageHeader";
import { ContentCard } from "../ContentCard";
import { FiltroTipoCliente } from "./FiltroTipoCliente";
import { ClientesLista } from "./ClientesLista";

export function ClientesSection({
  mercados,
  filtroAtivo,
  onFiltrar,
  onAdicionar,
  onAbrirPedidos,
  onEditar,
  onVerEndereco,
  onExcluir,
}) {
  return (
    <div className="animate-in fade-in duration-300 flex flex-col flex-1 min-h-0 pb-4 overflow-hidden">
      <div className="shrink-0">
        <PageHeader
          title="Clientes"
          subtitle="Gerencie os clientes parceiros da Alto Tietê"
          buttonText="Adicionar Cliente"
          onButtonClick={onAdicionar}
        />
      </div>

      <div className="flex-1 min-h-0">
        <ContentCard
          title="Todos os Clientes"
          count={mercados.length}
          subtitle="Selecione um Cliente para ver seus pedidos"
          filters={
            <FiltroTipoCliente filtroAtivo={filtroAtivo} onFiltrar={onFiltrar} />
          }
        >
          <ClientesLista
            mercados={mercados}
            onAbrirPedidos={onAbrirPedidos}
            onEditar={onEditar}
            onVerEndereco={onVerEndereco}
            onExcluir={onExcluir}
          />
        </ContentCard>
      </div>
    </div>
  );
}
