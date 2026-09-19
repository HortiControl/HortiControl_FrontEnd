import { useNavigate } from "react-router-dom";
import { criarUsuario } from "../../services/usuariosService";
import {
  validarNomeCompleto,
  validarEmail,
  validarTelefoneCadastro,
  validarSenhaForte,
} from "../../utils/validators";
import { useNotification } from "../../components/notifications/NotificationContext";

/** Orquestra estado e regra de negócio da tela de Cadastro. */
export function useCadastroPageState() {
  const navigate = useNavigate();
  const notify = useNotification();

  const handleCadastrar = async (dados) => {
    if (
      !dados.nome?.trim() ||
      !dados.email?.trim() ||
      !dados.senha?.trim() ||
      !dados.confirmarSenha?.trim()
    ) {
      notify.warning("Preencha os campos obrigatórios para continuar.");
      return;
    }

    const erroNome = validarNomeCompleto(dados.nome);
    if (erroNome) {
      notify.warning(erroNome);
      return;
    }

    const erroEmail = validarEmail(dados.email);
    if (erroEmail) {
      notify.warning(erroEmail);
      return;
    }

    const erroTelefone = validarTelefoneCadastro(dados.telefone);
    if (erroTelefone) {
      notify.warning(erroTelefone);
      return;
    }

    const erroSenha = validarSenhaForte(dados.senha);
    if (erroSenha) {
      notify.warning(erroSenha);
      return;
    }

    if (dados.senha !== dados.confirmarSenha) {
      notify.warning("As senhas não coincidem.");
      return;
    }

    try {
      await criarUsuario({
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        senha: dados.senha,
      });

      notify.success("Cadastro realizado com sucesso.");
      navigate("/login", { replace: true });
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 409 || error.response.status === 400)
      ) {
        notify.warning("Este e-mail já está cadastrado. Tente outro endereço.");
      } else {
        notify.error("Não foi possível concluir o cadastro. Tente novamente.");
      }
    }
  };

  return { handleCadastrar };
}
