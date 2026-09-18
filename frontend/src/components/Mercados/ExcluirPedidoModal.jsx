import { Modal } from "../Modal";
import { Button } from "../Button";

export function ExcluirPedidoModal({ isOpen, pedido, onClose, onConfirmar }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão" isDanger>
      <p className="text-gray-700">
        Tem certeza que deseja excluir o pedido
        <span className="font-bold"> #{pedido?.id ?? ""}</span>?
      </p>
      <div className="flex justify-center gap-3 mt-8">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmar}>
          Excluir Pedido
        </Button>
      </div>
    </Modal>
  );
}
