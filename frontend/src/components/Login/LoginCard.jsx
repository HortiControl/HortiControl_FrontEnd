import { useState } from "react";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Button } from "../Button";
import banner from "../../assets/banner.png";
import logo from "../../assets/HortiControlLogo.png";
import { useNavigate } from "react-router-dom";
import api from "../../provider/api";
import { useNotification } from "../notifications/NotificationContext";

const LoginCard = () => {
  const navigate = useNavigate();
  const notify = useNotification();

  const [mostrarSenha, setMostrarSenha] = useState(false);

  function direcionarCadastro() {
    navigate("/cadastro", { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const dados = Object.fromEntries(formData.entries());

    console.log(dados);

    if (!dados.email.trim() || !dados.senha.trim()) {
      notify.warning("Preencha o e-mail e a senha para continuar.");
      return;
    }

    try {
      const response = await api.post("/usuarios/login",
        {
          email: dados.email,
          senha: dados.senha,
        },
      );

      console.log("Resposta do servidor:", response.data);

      const dadosLogin = response.data;

      localStorage.setItem("token", dadosLogin.token);
      localStorage.setItem("userId", dadosLogin.idUsuario);

      notify.success("Login realizado com sucesso.");
      navigate("/", { replace: true });

    } catch (error) {
      console.log(error.message);
      notify.error("Não foi possível fazer login. Verifique seus dados e tente novamente.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat font-[Montserrat] px-4 py-8 sm:p-6"
      style={{ backgroundImage: `url(${banner})` }}
    >
      <div className="w-full max-w-md rounded-[25px] bg-white/95 p-5 shadow-2xl backdrop-blur-sm flex flex-col items-center sm:max-w-lg sm:p-8">
        <img src={logo} alt="Logo" className="mb-4 w-24 object-contain sm:w-28" />

        <h2 className="mb-1 text-center text-xl font-bold text-[#333] sm:text-2xl lg:text-3xl">Seja Bem-Vindo!</h2>
        <p className="mb-7 text-center text-xs text-gray-500 sm:text-sm">
          Faça o login e acesse o sistema
        </p>

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="mb-1.5 ml-1 text-xs font-semibold text-gray-700 sm:text-sm">
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
            <label className="mb-1.5 ml-1 text-xs font-semibold text-gray-700 sm:text-sm">
              Senha:
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={mostrarSenha ? "text" : "password"}
                name="senha"
                placeholder="•••••"
                className="w-full rounded-xl border-none bg-[#e9ecef] px-4 py-3 pl-10 pr-10 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#009951]"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center"
              >
                {mostrarSenha ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-[#009951] py-3.5 text-sm text-white hover:bg-[#007d42] sm:text-lg"
          >
            Entrar
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
