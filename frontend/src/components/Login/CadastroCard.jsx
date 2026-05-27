import { User, Mail, Phone, Lock, ArrowLeft } from "lucide-react";

import { Button } from "../Button";
import banner from "../../assets/banner.png";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CadastroCard = () => {
  const navigate = useNavigate();

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
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    // Nome não pode conter números, caracteres especiais ou ç
    if (
      !/^[A-Za-zÀ-ú\s]+$/.test(dados.nome.trim()) ||
      /[çÇ]/.test(dados.nome)
    ) {
      alert("O nome deve conter apenas letras sem caracteres especiais.");
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
      alert("Digite um e-mail válido!");
      return;
    }

    // Validações de telefone
    if (dados.telefone.trim()) {
      // Apenas números
      if (!/^\d+$/.test(dados.telefone)) {
        alert("O telefone deve conter apenas números.");
        return;
      }

      // Deve ter 10 ou 11 dígitos
      if (dados.telefone.length < 10 || dados.telefone.length > 11) {
        alert("O telefone deve ter 10 ou 11 dígitos.");
        return;
      }
    }

    //Validações de senha
    if (dados.senha.length < 5) {
      alert("A senha deve ter no mínimo 5 caracteres!");
      return;
    }

    // Não permite caracteres especiais
    if (!/^[a-zA-Z0-9]+$/.test(dados.senha)) {
      alert("A senha não pode conter caracteres especiais.");
      return;
    }

    if (dados.senha !== dados.confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/usuarios", {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        senha: dados.senha,
      });

      console.log(response);

      alert("Cadastro realizado com sucesso!");
      navigate("/login", { replace: true });
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 409 || error.response.status === 400)
      ) {
        alert("E-mail já cadastrado. Por favor, use outro e-mail.");
      } else {
        console.log(error.message);
        alert("Erro ao cadastrar");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat font-[Montserrat] p-4"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="w-full max-w-125 p-8 bg-white/95 backdrop-blur-sm rounded-[25px] shadow-2xl flex flex-col items-center">
        <div className="flex w-full">
          <Link
            to="/login"
            className="w-10 self-start flex items-center text-xs text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <ArrowLeft size={34} className="mr-1" />
          </Link>
          {/* <img src={logo} alt="Logo" className="w-18 mb-4 object-contain" /> */}
          <div className="items-center w-88">
            <h2 className="text-[#333] font-bold text-3xl mb-1 text-center">
              Criar uma conta
            </h2>
            <p className="text-gray-500 text-sm mb-6 text-center">
              Preencha os dados abaixo para se cadastrar
            </p>
          </div>
        </div>

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1 ml-1 text-sm">
              Nome Completo:
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="nome"
                placeholder="Seu nome"
                className="w-full pl-10 pr-4 py-2 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1 ml-1 text-sm">
              E-mail:
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="exemplo@email.com"
                className="w-full pl-10 pr-4 py-2 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1 ml-1 text-sm">
              Telefone (opcional):
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                maxLength={11}
                type="text"
                name="telefone"
                placeholder="(11) 91234 5678"
                className="w-full pl-10 pr-4 py-2 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1 ml-1 text-sm">
              Senha:
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="senha"
                placeholder="Mínimo 5 caracteres"
                className="w-full pl-10 pr-4 py-2 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1 ml-1 text-sm">
              Confirmar Senha:
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="confirmarSenha"
                placeholder="Digite a senha novamente"
                className="w-full pl-10 pr-4 py-2 bg-[#e9ecef] rounded-xl border-none focus:ring-2 focus:ring-[#009951] outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-xl text-lg bg-[#009951]! hover:bg-[#007d42]! text-white "
          >
            Criar uma conta
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CadastroCard;
