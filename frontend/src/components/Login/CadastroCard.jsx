import { User, Mail, Phone, Lock, ArrowLeft } from "lucide-react";

import { Button } from "../Button";
import banner from "../../assets/banner.png";
import { useNavigate, Link } from "react-router-dom";
import api from "../../provider/api";
import { useNotification } from "../notifications/NotificationContext";

const CadastroCard = () => {
  const navigate = useNavigate();
  const notify = useNotification();

  //Para realizar o envio das informações do
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Captura as informações do formulário
    const formData = new FormData(e.currentTarget);

    // Transforma em objeto json
    const dados = Object.fromEntries(formData.entries());

    console.log(dados);

    // Validação de campos vazios
    if (
      !dados.nome.trim() ||
      !dados.email.trim() ||
      !dados.senha.trim() ||
      !dados.confirmarSenha.trim()
    ) {
      notify.warning("Preencha os campos obrigatórios para continuar.");
      return;
    }

    // Nome não pode conter números, caracteres especiais ou ç
    if (
      !/^[A-Za-zÀ-ú\s]+$/.test(dados.nome.trim()) ||
      /[çÇ]/.test(dados.nome)
    ) {
      notify.warning("O nome deve conter apenas letras.");
      return;
    }

    const email = dados.email.trim();

    // Validações de email
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

    // Validações de telefone
    if (dados.telefone.trim()) {
      // Apenas números
      if (!/^\d+$/.test(dados.telefone)) {
        notify.warning("O telefone deve conter apenas números.");
        return;
      }

      // Deve ter 10 ou 11 dígitos
      if (dados.telefone.length < 10 || dados.telefone.length > 11) {
        notify.warning("O telefone deve ter 10 ou 11 dígitos.");
        return;
      }
    }

    //Validações de senha
    if (dados.senha.length < 5) {
      notify.warning("A senha deve ter no mínimo 5 caracteres.");
      return;
    }

    // Não permite caracteres especiais
    if (!/^[a-zA-Z0-9]+$/.test(dados.senha)) {
      notify.warning("A senha não pode conter caracteres especiais.");
      return;
    }

    if (dados.senha !== dados.confirmarSenha) {
      notify.warning("As senhas não coincidem.");
      return;
    }

    try {
      const response = await api.post("/usuarios", {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        senha: dados.senha,
      });

      console.log(response);

      notify.success("Cadastro realizado com sucesso.");
      navigate("/login", { replace: true });
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 409 || error.response.status === 400)
      ) {
        notify.warning("Este e-mail já está cadastrado. Tente outro endereço.");
      } else {
        console.log(error.message);
        notify.error("Não foi possível concluir o cadastro. Tente novamente.");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat font-[Montserrat] px-4 py-8 sm:p-6"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="w-full max-w-md rounded-[25px] bg-white/95 p-5 shadow-2xl backdrop-blur-sm flex flex-col items-center sm:max-w-xl sm:p-8">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
          <Link
            to="/login"
            className="flex h-10 w-10 items-center justify-center self-start rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <ArrowLeft size={22} />
          </Link>
          <div className="w-full flex-1">
            <h2 className="mb-1 text-center text-xl font-bold text-[#333] sm:text-2xl lg:text-3xl">
              Criar uma conta
            </h2>
            <p className="mb-6 text-center text-xs text-gray-500 sm:text-sm">
              Preencha os dados abaixo para se cadastrar
            </p>
          </div>
        </div>

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-1 ml-1 text-xs font-semibold text-gray-700 sm:text-sm">
              Nome Completo:
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="nome"
                placeholder="Seu nome"
                className="w-full rounded-xl border-none bg-[#e9ecef] px-4 py-3 pl-10 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#009951]"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 ml-1 text-xs font-semibold text-gray-700 sm:text-sm">
              E-mail:
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="exemplo@email.com"
                className="w-full rounded-xl border-none bg-[#e9ecef] px-4 py-3 pl-10 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#009951]"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 ml-1 text-xs font-semibold text-gray-700 sm:text-sm">
              Telefone (opcional):
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                maxLength={11}
                type="text"
                name="telefone"
                placeholder="(11) 91234 5678"
                className="w-full rounded-xl border-none bg-[#e9ecef] px-4 py-3 pl-10 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#009951]"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 ml-1 text-xs font-semibold text-gray-700 sm:text-sm">
              Senha:
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="senha"
                placeholder="Mínimo 5 caracteres"
                className="w-full rounded-xl border-none bg-[#e9ecef] px-4 py-3 pl-10 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#009951]"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 ml-1 text-xs font-semibold text-gray-700 sm:text-sm">
              Confirmar Senha:
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="confirmarSenha"
                placeholder="Digite a senha novamente"
                className="w-full rounded-xl border-none bg-[#e9ecef] px-4 py-3 pl-10 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#009951]"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-2 w-full rounded-xl bg-[#009951] py-3.5 text-sm text-white hover:bg-[#007d42] sm:text-lg"
          >
            Criar uma conta
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CadastroCard;
