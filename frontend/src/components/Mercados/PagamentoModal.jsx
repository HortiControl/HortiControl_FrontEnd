import { Modal } from "../Modal";
import { Input } from "../Input";
import { Button } from "../Button";

export function PagamentoModal({
  isOpen,
  pedido,
  valorPago,
  onChangeValorPago,
  onClose,
  onConfirmar,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Valor Pago"
      subtitle="Insira quanto do valor do pedido já foi pago"
    >
      <Input
        label="Pago (R$)"
        placeholder="Ex: 100,00"
        value={valorPago}
        onChange={(e) => onChangeValorPago(e.target.value)}
      />

      <div className="flex flex-row justify-between max-h-10 mt-7">
        <div className="flex flex-col gap-1 p-2 rounded-lg justify-center border-2 border-gray-300 bg-gray-100">
          <p className="text-gray-700 text-[12px] font-medium">
            Total: R${" "}
            {Number(pedido?.valorTotal || 0)
              .toFixed(2)
              .replace(".", ",")}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirmar}>
            Registrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
