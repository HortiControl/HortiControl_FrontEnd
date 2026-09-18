import { Modal } from "../Modal";
import { Input } from "../Input";
import { Select } from "../Select";
import { Button } from "../Button";

export function ProdutoFormModal({
  isOpen,
  isEdicao,
  formData,
  onChangeCampo,
  onClose,
  onSalvar,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdicao ? "Editar Produto" : "Adicionar Novo Produto"}
    >
      <Input
        label="Nome do Produto:"
        placeholder="Ex: Alface Lisa"
        value={formData.nome}
        onChange={(e) => onChangeCampo("nome", e.target.value)}
      />
      <Select
        label="Tipo de Processamento"
        options={["PRE-LAVADO", "NAO-LAVADO"]}
        value={formData.tipo}
        onChange={(e) => onChangeCampo("tipo", e.target.value.replace("-", "_"))}
      />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Select
          label="Embalagem"
          options={["POTE", "BANDEJA", "SACO"]}
          value={formData.embalagem}
          onChange={(e) => onChangeCampo("embalagem", e.target.value)}
        />
        <Input
          label="Preço Atual (R$)"
          placeholder="0,00"
          value={formData.preco}
          onChange={(e) => onChangeCampo("preco", e.target.value)}
        />
      </div>
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
