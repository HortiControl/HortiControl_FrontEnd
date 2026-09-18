import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { atualizarPerfil, atualizarSenha } from "../services/usuariosService";
import {
  validarNomeCompleto,
  validarTelefone,
  validarEmail,
  validarNovaSenha,
} from "../utils/validators";
import { useNotification } from "../components/notifications/NotificationContext";

const SENHAS_INICIAIS = { senhaAtual: "", novaSenha: "", confirmacao: "" };

/** Orquestra estado e regra de negócio da tela de Perfil. */
export function usePerfilPageState() {
  const navigate = useNavigate();
  const notify = useNotification();
  const { usuario, logout } = useAuth();

  const [perfil, setPerfil] = useState({ nome: "", email: "", telefone: "" });
  const [senhas, setSenhas] = useState(SENHAS_INICIAIS);

  /*
   * Sincroniza perfil a partir de usuario sem useEffect: ajustar estado
   * durante a renderização evita o re-render em cascata do padrão anterior
   * (ver https://react.dev/learn/you-might-not-need-an-effect).
   */
  const [usuarioSincronizado, setUsuarioSincronizado] = useState(null);
  if (usuario && usuario !== usuarioSincronizado) {
    setUsuarioSincronizado(usuario);
    setPerfil({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone || "",
    });
  }

  const handleAlterarCampoPerfil = (campo, valor) => {
    setPerfil((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleAlterarCampoSenha = (campo, valor) => {
    setSenhas((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSalvarPerfil = async () => {
    const erroNome = validarNomeCompleto(perfil.nome);
    if (erroNome) {
      notify.warning(erroNome);
      return;
    }

    const erroTelefone = validarTelefone(perfil.telefone);
    if (erroTelefone) {
      notify.warning(erroTelefone);
      return;
    }

    const erroEmail = validarEmail(perfil.email);
    if (erroEmail) {
      notify.warning(erroEmail);
      return;
    }

    try {
      await atualizarPerfil(perfil);

      notify.success("Perfil atualizado com sucesso. Faça o login novamente.");

      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      notify.error("Não foi possível atualizar o perfil. Verifique os dados.");
      console.error(error);
    }
  };

  const handleAtualizarSenha = async () => {
    const erroSenha = validarNovaSenha(senhas.novaSenha, senhas.confirmacao);
    if (erroSenha) {
      notify.warning(erroSenha);
      return;
    }

    try {
      await atualizarSenha({
        senhaAtual: senhas.senhaAtual,
        novaSenha: senhas.novaSenha,
      });

      notify.success("Senha atualizada com sucesso.");
      setSenhas(SENHAS_INICIAIS);
    } catch (error) {
      notify.error(
        "Não foi possível atualizar a senha. Verifique a senha atual.",
      );
      console.error(error);
    }
  };

  return {
    perfil,
    onChangeCampoPerfil: handleAlterarCampoPerfil,
    senhas,
    onChangeCampoSenha: handleAlterarCampoSenha,
    handleSalvarPerfil,
    handleAtualizarSenha,
  };
}
