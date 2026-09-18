import { Modal } from "../Modal";
import { Input } from "../Input";
import { Button } from "../Button";

export function ReajustarPrecoModal({ isOpen, onClose, onChangeValorGlobal, onConfirmar }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reajustar Preços">
      <Input
        label="Novo Valor (R$)"
        placeholder="Ex: 9,00"
        onChange={(e) => onChangeValorGlobal(e.target.value)}
      />
      <div className="flex justify-center gap-3 mt-6">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onConfirmar}>
          Aplicar Reajuste
        </Button>
      </div>
    </Modal>
  );
}
