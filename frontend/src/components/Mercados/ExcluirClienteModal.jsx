import { Modal } from "../Modal";
import { Button } from "../Button";

export function ExcluirClienteModal({ isOpen, mercado, onClose, onConfirmar }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão" isDanger>
      <p className="text-gray-700">
        Tem certeza que deseja excluir o cliente{" "}
        <span className="font-bold">{mercado?.nome}</span>?
      </p>
      <div className="flex justify-center gap-3 mt-8">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmar}>
          Excluir Cliente
        </Button>
      </div>
    </Modal>
  );
}
