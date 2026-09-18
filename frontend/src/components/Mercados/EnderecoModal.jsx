import { Modal } from "../Modal";
import { Button } from "../Button";
import { formatarCEP } from "../../utils/formatters";

export function EnderecoModal({
  isOpen,
  onClose,
  endereco,
  loadingEndereco,
  numeroMercado,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Endereço do Cliente"
      maxWidth="max-w-lg"
    >
      {loadingEndereco && (
        <p className="text-gray-500">Carregando endereço...</p>
      )}

      {!loadingEndereco && endereco && (
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>CEP:</strong> {formatarCEP(endereco.cep) || "—"}
          </div>
          <div>
            <strong>Logradouro:</strong> {endereco.logradouro || "—"}
          </div>
          <div>
            <strong>Número:</strong> {numeroMercado || "—"}
          </div>
          <div>
            <strong>Bairro:</strong> {endereco.bairro || "—"}
          </div>
          <div>
            <strong>Cidade:</strong> {endereco.localidade}
          </div>
          <div>
            <strong>Estado:</strong> {endereco.uf}
          </div>
        </div>
      )}

      {!loadingEndereco && !endereco && (
        <p className="text-red-500">Endereço não encontrado.</p>
      )}

      <div className="flex justify-end mt-6">
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </Modal>
  );
}
