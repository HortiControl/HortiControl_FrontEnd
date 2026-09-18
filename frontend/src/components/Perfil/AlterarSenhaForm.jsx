import { Lock, RefreshCw } from "lucide-react";
import { CampoComIcone } from "./CampoComIcone";

export function AlterarSenhaForm({ senhas, onChangeCampo, onAtualizarSenha }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="mb-1 text-lg font-bold text-gray-800 sm:text-xl">
        Alterar Senha
      </h2>
      <p className="mb-6 text-sm text-gray-500 sm:mb-8">
        Atualize sua senha para manter sua conta segura
      </p>

      <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 sm:gap-y-6">
        <CampoComIcone
          icon={Lock}
          label="Senha Atual"
          type="password"
          value={senhas.senhaAtual}
          onChange={(valor) => onChangeCampo("senhaAtual", valor)}
          placeholder="••••••"
        />
        <CampoComIcone
          icon={Lock}
          label="Nova Senha"
          type="password"
          value={senhas.novaSenha}
          onChange={(valor) => onChangeCampo("novaSenha", valor)}
          placeholder="Mínimo 5 Caracteres"
        />
        <CampoComIcone
          icon={Lock}
          label="Confirmar Nova Senha"
          type="password"
          value={senhas.confirmacao}
          onChange={(valor) => onChangeCampo("confirmacao", valor)}
          placeholder="Digite a senha novamente"
        />
      </div>

      <div className="mt-6 sm:mt-8">
        <button
          onClick={onAtualizarSenha}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#00a859] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#008f4c]"
        >
          <RefreshCw size={18} /> Atualizar Senha
        </button>
      </div>
    </section>
  );
}
