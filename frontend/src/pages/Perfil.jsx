import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  Save,
  RefreshCw,
} from "lucide-react";

import api from "../provider/api";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useNotification } from "../components/notifications/NotificationContext";

export default function Perfil() {
  // 1. Configuração base (Pegando dados salvos no Login)

  const navigate = useNavigate();
  const notify = useNotification();

  // 2. Estados para armazenar os dados dos formulários
  /*
   * usuario contém os dados retornados por GET /usuarios/me.
   * logout solicita ao backend a remoção do cookie HttpOnly.
   */
  const { usuario, logout } = useAuth();

  const [perfil, setPerfil] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const [senhas, setSenhas] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmacao: "",
  });

  // 3. Efeito que roda ao abrir a tela: Busca os dados no Backend
  useEffect(() => {
    /*
     * Não buscamos mais o usuário por um ID guardado no localStorage.
     * Os dados já foram obtidos pelo AuthContext em /usuarios/me.
     */
    if (usuario) {
      setPerfil({
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || "",
      });
    }
  }, [usuario]);

  // 4. Função para atualizar as informações pessoais (PUT)
  const handleSalvarPerfil = async () => {
    if (!perfil.nome.trim()) {
      notify.warning("Digite seu nome completo.");
      return;
    }

    // Validação original mantida sem alteração.
    if (
      !/^[A-Za-zÀ-ú\s]+$/.test(perfil.nome.trim()) ||
      /[çÇ]/.test(perfil.nome)
    ) {
      notify.warning("O nome deve conter apenas letras.");
      return;
    }

    if (perfil.telefone && !/^\d{0,11}$/.test(perfil.telefone)) {
      notify.warning(
        "O telefone deve conter apenas números e no máximo 11 dígitos.",
      );
      return;
    }

    if (!perfil.email.trim()) {
      notify.warning("Digite um e-mail.");
      return;
    }

    const email = perfil.email.trim();

    if (
      !email.includes("@") ||
      !email.includes(".") ||
      email.startsWith("@") ||
      email.endsWith("@") ||
      email.endsWith(".")
    ) {
      notify.warning("Digite um e-mail válido.");
      return;
    }

    try {
      /*
       * O backend identifica o usuário por meio do JWT já validado.
       * O frontend não precisa enviar ou controlar um ID de usuário.
       */
      await api.put("/usuarios/me/perfil", perfil);

      notify.success("Perfil atualizado com sucesso. Faça o login novamente.");

      /*
       * Como o cookie é HttpOnly, localStorage.removeItem não o apagaria.
       * A remoção precisa ser feita pelo endpoint de logout.
       */
      await logout();

      navigate("/login", { replace: true });
    } catch (error) {
      notify.error("Não foi possível atualizar o perfil. Verifique os dados.");

      console.error(error);
    }
  };

  // 5. Função para atualizar a senha (PATCH)
  const handleAtualizarSenha = async () => {
    if (senhas.novaSenha !== senhas.confirmacao) {
      notify.warning("A nova senha e a confirmação não batem.");
      return;
    }

    /*
     * As validações originais foram mantidas.
     * Nenhuma regra de senha foi alterada.
     */
    if (senhas.novaSenha.length < 5) {
      notify.warning("A senha deve ter no mínimo 5 caracteres.");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(senhas.novaSenha)) {
      notify.warning("A senha não pode conter caracteres especiais.");
      return;
    }

    try {
      /*
       * O backend obtém o usuário pelo JWT validado no cookie.
       * Não é mais necessário enviar userId ou Authorization.
       */
      await api.put("/usuarios/me/senha", {
        senhaAtual: senhas.senhaAtual,
        novaSenha: senhas.novaSenha,
      });

      notify.success("Senha atualizada com sucesso.");

      setSenhas({
        senhaAtual: "",
        novaSenha: "",
        confirmacao: "",
      });
    } catch (error) {
      notify.error(
        "Não foi possível atualizar a senha. Verifique a senha atual.",
      );

      console.error(error);
    }
  };

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
        {/* --- SESSÃO 1: PERFIL --- */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="mb-1 text-lg font-bold text-gray-800 sm:text-xl">
            Informações Pessoais
          </h2>
          <p className="mb-6 text-sm text-gray-500 sm:mb-8">
            Visualize ou altere suas informações de perfil
          </p>

          <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
            <div className="relative">
              <label className="mb-2 block text-xs font-bold text-gray-700 sm:text-sm">
                Nome Completo
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 text-gray-400" size={18} />
                <input
                  type="text"
                  value={perfil.nome}
                  onChange={(e) =>
                    setPerfil({ ...perfil, nome: e.target.value })
                  }
                  className="w-full rounded-xl bg-gray-100 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#00a859]/20"
                />
              </div>
            </div>

            <div className="relative">
              <label className="mb-2 block text-xs font-bold text-gray-700 sm:text-sm">
                E-mail
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-gray-400" size={18} />
                <input
                  type="email"
                  value={perfil.email}
                  onChange={(e) =>
                    setPerfil({ ...perfil, email: e.target.value })
                  }
                  className="w-full rounded-xl bg-gray-100 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#00a859]/20"
                />
              </div>
            </div>

            <div className="relative">
              <label className="mb-2 block text-xs font-bold text-gray-700 sm:text-sm">
                Telefone
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-4 text-gray-400" size={18} />
                <input
                  type="text"
                  maxLength={11}
                  placeholder="11999999999"
                  value={perfil.telefone}
                  onChange={(e) =>
                    setPerfil({ ...perfil, telefone: e.target.value })
                  }
                  className="w-full rounded-xl bg-gray-100 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#00a859]/20"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <button
              onClick={handleSalvarPerfil}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#00a859] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#008f4c]"
            >
              <Save size={18} /> Salvar Alterações
            </button>
          </div>
        </section>

        {/* --- SESSÃO 2: SENHA --- */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="mb-1 text-lg font-bold text-gray-800 sm:text-xl">
            Alterar Senha
          </h2>
          <p className="mb-6 text-sm text-gray-500 sm:mb-8">
            Atualize sua senha para manter sua conta segura
          </p>

          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2 sm:gap-y-6">
            <div className="relative">
              <label className="mb-2 block text-xs font-bold text-gray-700 sm:text-sm">
                Senha Atual
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-gray-400" size={18} />
                <input
                  type="password"
                  value={senhas.senhaAtual}
                  onChange={(e) =>
                    setSenhas({ ...senhas, senhaAtual: e.target.value })
                  }
                  placeholder="••••••"
                  className="w-full rounded-xl bg-gray-100 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#00a859]/20"
                />
              </div>
            </div>

            <div className="relative">
              <label className="mb-2 block text-xs font-bold text-gray-700 sm:text-sm">
                Nova Senha
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-gray-400" size={18} />
                <input
                  type="password"
                  value={senhas.novaSenha}
                  onChange={(e) =>
                    setSenhas({ ...senhas, novaSenha: e.target.value })
                  }
                  placeholder="Mínimo 5 Caracteres"
                  className="w-full rounded-xl bg-gray-100 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#00a859]/20"
                />
              </div>
            </div>

            <div className="relative">
              <label className="mb-2 block text-xs font-bold text-gray-700 sm:text-sm">
                Confirmar Nova Senha
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-gray-400" size={18} />
                <input
                  type="password"
                  value={senhas.confirmacao}
                  onChange={(e) =>
                    setSenhas({ ...senhas, confirmacao: e.target.value })
                  }
                  placeholder="Digite a senha novamente"
                  className="w-full rounded-xl bg-gray-100 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#00a859]/20"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <button
              onClick={handleAtualizarSenha}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#00a859] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#008f4c]"
            >
              <RefreshCw size={18} /> Atualizar Senha
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
