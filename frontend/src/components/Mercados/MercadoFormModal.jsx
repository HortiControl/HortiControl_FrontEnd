import { Modal } from "../Modal";
import { Input } from "../Input";
import { Select } from "../Select";
import { Button } from "../Button";
import { formatarCEP } from "../../utils/formatters";

export function MercadoFormModal({
  isOpen,
  isEdicao,
  formData,
  onChangeCampo,
  onChangeCep,
  endereco,
  loadingEndereco,
  onClose,
  onSalvar,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdicao ? "Editar Cliente" : "Adicionar Novo Cliente"}
      subtitle={
        isEdicao
          ? "Altere os detalhes do cliente selecionado."
          : "Insira os detalhes do novo cliente"
      }
    >
      <Input
        label="Nome do Cliente:"
        placeholder="Ex: MJ4"
        value={formData.nome}
        onChange={(e) => onChangeCampo("nome", e.target.value)}
      />

      <Select
        label="Tipo:"
        options={["NORMAL", "CONSIGNADO"]}
        value={formData.tipo}
        onChange={(e) => onChangeCampo("tipo", e.target.value)}
      />

      <Input
        label="CEP:"
        placeholder="Ex: 01234-567"
        value={formatarCEP(formData.cep)}
        onChange={(e) => onChangeCep(e.target.value)}
      />
      {loadingEndereco && (
        <p className="text-sm text-gray-500 mt-2">Buscando endereço...</p>
      )}

      {endereco && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Input label="Logradouro" value={endereco.logradouro} disabled />
          <Input label="Bairro" value={endereco.bairro} disabled />
          <Input label="Cidade" value={endereco.localidade} disabled />
          <Input label="Estado" value={endereco.uf} disabled />
        </div>
      )}

      <Input
        label="Número:"
        placeholder="Ex: 123"
        value={formData.numero}
        maxLength={6}
        onChange={(e) => onChangeCampo("numero", e.target.value)}
      />

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSalvar}>
          {isEdicao ? "Salvar Alterações" : "Salvar"}
        </Button>
      </div>
    </Modal>
  );
}
