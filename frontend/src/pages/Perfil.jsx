import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  Save,
  RefreshCw,
} from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import axios from "axios";

export default function Perfil() {
  // 1. Configuração base (Pegando dados salvos no Login)
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // O ID do usuário logado

  // 2. Estados para armazenar os dados dos formulários
  const [perfil, setPerfil] = useState({ nome: "", email: "", telefone: "" });
  const [senhas, setSenhas] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmacao: "",
  });

  // 3. Efeito que roda ao abrir a tela: Busca os dados no Backend
  useEffect(() => {
    if (userId && token) {
      axios
        .get(`http://localhost:8080/usuarios/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // Preenche o estado com os dados vindos do banco
          setPerfil({
            nome: response.data.nome,
            email: response.data.email,
            telefone: response.data.telefone || "",
          });
        })
        .catch((error) => console.error("Erro ao carregar perfil:", error));
    }
  }, [userId, token]);

  // 4. Função para atualizar as informações pessoais (PUT)
  const handleSalvarPerfil = async () => {
    if (!perfil.nome.trim()) {
      alert("Digite seu nome completo.");
      return;
    }

    if (perfil.telefone && !/^\d{0,11}$/.test(perfil.telefone)) {
        alert("O telefone deve conter apenas números e no máximo 11 dígitos.");
        return;
      }

    // Email obrigatório
    if (!perfil.email.trim()) {
      alert("Digite um e-mail.");
      return;
    }


    // Validação de email
    const email = perfil.email.trim();

    if (
      !email.includes("@") ||
      !email.includes(".") ||
      email.startsWith("@") ||
      email.endsWith("@") ||
      email.endsWith(".")
    ) {
      alert("Digite um e-mail válido.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/usuarios/perfil/${userId}`,
        perfil,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      
        alert("Erro ao atualizar o perfil. Verifique os dados.");
        console.error(error);
    }
  };

  // 5. Função para atualizar a senha (PATCH)
  const handleAtualizarSenha = async () => {
    if (senhas.novaSenha !== senhas.confirmacao) {
      alert("A nova senha e a confirmação não batem!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/usuarios/senha/${userId}`,
        {
          senhaAtual: senhas.senhaAtual,
          novaSenha: senhas.novaSenha,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Senha atualizada com sucesso!");
      setSenhas({ senhaAtual: "", novaSenha: "", confirmacao: "" }); // Limpa os campos
    } catch (error) {
      alert(
        "Erro ao atualizar senha. Verifique se sua senha atual está correta.",
      );
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-6xl">
      <Link
        to="/"
        className="flex items-center text-xs text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft size={14} className="mr-1" /> Voltar para Dashboard
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie suas informações pessoais
        </p>
      </header>

      <div className="space-y-6">
        {/* --- SESSÃO 1: PERFIL --- */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Informações Pessoais
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Visualize ou altere suas informações de perfil
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="relative">
              <label className="text-sm font-bold text-gray-700 mb-2 block">
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-bold text-gray-700 mb-2 block">
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-bold text-gray-700 mb-2 block">
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleSalvarPerfil}
              className="bg-[#00a859] hover:bg-[#008f4c] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer"
            >
              <Save size={18} /> Salvar Alterações
            </button>
          </div>
        </section>

        {/* --- SESSÃO 2: SENHA --- */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Alterar Senha
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Atualize sua senha para manter sua conta segura
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="relative">
              <label className="text-sm font-bold text-gray-700 mb-2 block">
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-bold text-gray-700 mb-2 block">
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm font-bold text-gray-700 mb-2 block">
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a859]/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleAtualizarSenha}
              className="bg-[#00a859] hover:bg-[#008f4c] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer"
            >
              <RefreshCw size={18} /> Atualizar Senha
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
