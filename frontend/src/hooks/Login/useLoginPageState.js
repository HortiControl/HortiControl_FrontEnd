import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../components/notifications/NotificationContext";

/** Orquestra estado e regra de negócio da tela de Login. */
export function useLoginPageState() {
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotification();
  const { login } = useAuth();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleAlternarMostrarSenha = () => {
    setMostrarSenha((prev) => !prev);
  };

  const direcionarCadastro = () => {
    navigate("/cadastro", { replace: true });
  };

  const handleLogin = async (email, senha) => {
    if (!email || !senha) {
      notify.warning("Preencha o e-mail e a senha para continuar.");
      return;
    }

    try {
      setEnviando(true);

      await login(email, senha);

      notify.success("Login realizado com sucesso.");

      /*
       * Recupera a página que o usuário tentou acessar antes do login.
       * Aceita somente caminhos internos (impede redirecionamento externo).
       */
      const origem = location.state?.from;
      const caminhoInterno =
        origem?.pathname?.startsWith("/") && !origem.pathname.startsWith("//");

      const destino = caminhoInterno
        ? `${origem.pathname}${origem.search ?? ""}${origem.hash ?? ""}`
        : "/";

      navigate(destino, { replace: true });
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

  return {
    mostrarSenha,
    onAlternarMostrarSenha: handleAlternarMostrarSenha,
    enviando,
    direcionarCadastro,
    handleLogin,
  };
}
