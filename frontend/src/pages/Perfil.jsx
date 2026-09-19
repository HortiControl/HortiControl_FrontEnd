import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { usePerfilPageState } from "../hooks/Perfil/usePerfilPageState";
import { InformacoesPessoaisForm } from "../components/Perfil/InformacoesPessoaisForm";
import { AlterarSenhaForm } from "../components/Perfil/AlterarSenhaForm";

export default function Perfil() {
  const {
    perfil,
    onChangeCampoPerfil,
    senhas,
    onChangeCampoSenha,
    handleSalvarPerfil,
    handleAtualizarSenha,
  } = usePerfilPageState();

  return (
    <div className="max-w-6xl p-4 sm:p-6">
      <Link
        to="/"
        className="flex items-center text-xs text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft size={14} className="mr-1" /> Voltar para Dashboard
      </Link>

      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Perfil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas informações pessoais
        </p>
      </header>

      <div className="space-y-5 sm:space-y-6">
        <InformacoesPessoaisForm
          perfil={perfil}
          onChangeCampo={onChangeCampoPerfil}
          onSalvarPerfil={handleSalvarPerfil}
        />

        <AlterarSenhaForm
          senhas={senhas}
          onChangeCampo={onChangeCampoSenha}
          onAtualizarSenha={handleAtualizarSenha}
        />
      </div>
    </div>
  );
}
