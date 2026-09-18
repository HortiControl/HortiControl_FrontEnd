import { User, Mail, Phone, Save } from "lucide-react";
import { CampoComIcone } from "./CampoComIcone";

export function InformacoesPessoaisForm({ perfil, onChangeCampo, onSalvarPerfil }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="mb-1 text-lg font-bold text-gray-800 sm:text-xl">
        Informações Pessoais
      </h2>
      <p className="mb-6 text-sm text-gray-500 sm:mb-8">
        Visualize ou altere suas informações de perfil
      </p>

      <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        <CampoComIcone
          icon={User}
          label="Nome Completo"
          value={perfil.nome}
          onChange={(valor) => onChangeCampo("nome", valor)}
        />
        <CampoComIcone
          icon={Mail}
          label="E-mail"
          type="email"
          value={perfil.email}
          onChange={(valor) => onChangeCampo("email", valor)}
        />
        <CampoComIcone
          icon={Phone}
          label="Telefone"
          maxLength={11}
          placeholder="11999999999"
          value={perfil.telefone}
          onChange={(valor) => onChangeCampo("telefone", valor)}
        />
      </div>

      <div className="mt-6 sm:mt-8">
        <button
          onClick={onSalvarPerfil}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#00a859] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#008f4c]"
        >
          <Save size={18} /> Salvar Alterações
        </button>
      </div>
    </section>
  );
}
