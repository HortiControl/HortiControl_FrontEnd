import { User, Mail, Phone, Lock, ArrowLeft } from "lucide-react";

import { Button } from "../Button";
import banner from "../../assets/banner.png";
import { Link } from "react-router-dom";
import { useCadastroPageState } from "../../hooks/Login/useCadastroPageState";
import { CampoAuthComIcone } from "./CampoAuthComIcone";

const CadastroCard = () => {
  const { handleCadastrar } = useCadastroPageState();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const dados = Object.fromEntries(formData.entries());

    handleCadastrar(dados);
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
          <CampoAuthComIcone
            icon={User}
            label="Nome Completo:"
            name="nome"
            placeholder="Seu nome"
          />

          <CampoAuthComIcone
            icon={Mail}
            label="E-mail:"
            type="email"
            name="email"
            placeholder="exemplo@email.com"
          />

          <CampoAuthComIcone
            icon={Phone}
            label="Telefone (opcional):"
            name="telefone"
            placeholder="(11) 91234 5678"
            maxLength={11}
          />

          <CampoAuthComIcone
            icon={Lock}
            label="Senha:"
            type="password"
            name="senha"
            placeholder="Mínimo 5 caracteres"
          />

          <CampoAuthComIcone
            icon={Lock}
            label="Confirmar Senha:"
            type="password"
            name="confirmarSenha"
            placeholder="Digite a senha novamente"
          />

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
