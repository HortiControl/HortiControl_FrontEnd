import { Mail, Lock } from "lucide-react";
import { Button } from "../Button";
import banner from "../../assets/banner.png";
import logo from "../../assets/HortiControlLogo.png";
import { useLoginPageState } from "../../hooks/Login/useLoginPageState";
import { CampoAuthComIcone } from "./CampoAuthComIcone";

const LABEL_CLASS = "mb-1.5 ml-1 text-xs font-semibold text-gray-700 sm:text-sm";

const LoginCard = () => {
  const {
    mostrarSenha,
    onAlternarMostrarSenha,
    enviando,
    direcionarCadastro,
    handleLogin,
  } = useLoginPageState();

  const handleSubmit = (event) => {
    /*
     * Impede o recarregamento padrão da página.
     */
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const dados = Object.fromEntries(formData.entries());

    const email = String(dados.email ?? "").trim();
    const senha = String(dados.senha ?? "");

    handleLogin(email, senha);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat font-[Montserrat] px-4 py-8 sm:p-6"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="w-full max-w-md rounded-[25px] bg-white/95 p-5 shadow-2xl backdrop-blur-sm flex flex-col items-center sm:max-w-lg sm:p-8">
        <img
          src={logo}
          alt="Logo"
          className="mb-4 w-24 object-contain sm:w-28"
        />

        <h2 className="mb-1 text-center text-xl font-bold text-[#333] sm:text-2xl lg:text-3xl">
          Seja Bem-Vindo!
        </h2>
        <p className="mb-7 text-center text-xs text-gray-500 sm:text-sm">
          Faça o login e acesse o sistema
        </p>

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <CampoAuthComIcone
            icon={Mail}
            label="E-mail:"
            labelClassName={LABEL_CLASS}
            type="email"
            name="email"
            placeholder="exemplo@email.com"
          />

          <CampoAuthComIcone
            icon={Lock}
            label="Senha:"
            labelClassName={LABEL_CLASS}
            name="senha"
            placeholder="•••••"
            comToggleSenha
            senhaVisivel={mostrarSenha}
            onToggleSenha={onAlternarMostrarSenha}
          />

          <Button
            type="submit"
            /*
             * Impede novos cliques durante o login.
             */
            disabled={enviando}
            className="w-full rounded-xl bg-[#009951] py-3.5 text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {enviando ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-xs text-gray-600 sm:text-sm">
          Não têm uma conta?{" "}
          <span
            onClick={direcionarCadastro}
            className="text-[#009951] font-bold cursor-pointer hover:underline"
          >
            Cadastre-se
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
