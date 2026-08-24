import { useState } from "react";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Button } from "../Button";
import banner from "../../assets/banner.png";
import logo from "../../assets/HortiControlLogo.png";
import { useNavigate } from "react-router-dom";
import api from "../../provider/api";
import { useNotification } from "../notifications/NotificationContext";
import { useAuth } from "../../context/AuthContext";

const LoginCard = () => {
  const navigate = useNavigate();
  const notify = useNotification();

  // Função de login fornecida pelo AuthContext.
  const { login } = useAuth();

  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Impede múltiplos envios simultâneos.

  const [enviando, setEnviando] = useState(false);

  function direcionarCadastro() {
  /*
   * Direciona o usuário anônimo para a página de cadastro.
   */
  navigate("/cadastro", { replace: true });
}
  const handleSubmit = async (event) => {
    /*
     * Impede o recarregamento padrão da página.
     */
    event.preventDefault();

    /*
     * Lê os campos do formulário.
     */
    const formData = new FormData(event.currentTarget);

    const dados = Object.fromEntries(formData.entries());

    const email = String(dados.email ?? "").trim();

    const senha = String(dados.senha ?? "");

    if (!email || !senha) {
      notify.warning("Preencha o e-mail e a senha para continuar.");

      return;
    }

    try {
      setEnviando(true);

      /*
       * O AuthContext executará o login
       * e confirmará a sessão em /usuarios/me.
       */
      await login(email, senha);

      notify.success("Login realizado com sucesso.");

      /*
       * Recupera a página que o usuário
       * tentou acessar antes do login.
       */
      const origem = location.state?.from;

      /*
       * Aceita somente caminhos internos.
       *
       * O teste de "//" impede uma URL externa
       * interpretada como endereço absoluto.
       */
      const caminhoInterno =
        origem?.pathname?.startsWith("/") && !origem.pathname.startsWith("//");

      const destino = caminhoInterno
        ? `${origem.pathname}${origem.search ?? ""}${origem.hash ?? ""}`
        : "/";

      navigate(destino, {
        replace: true,
      });
    } catch {
      /*
       * A mensagem não revela se o e-mail existe.
       */
      notify.error(
        "Não foi possível fazer login. Verifique seus dados e tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
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
