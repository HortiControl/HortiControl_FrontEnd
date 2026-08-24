import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../provider/api";

/*
 * Context permite compartilhar informações
 * entre componentes sem passar propriedades
 * manualmente por todos os níveis.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  /*
   * useState armazena informações que podem mudar
   * enquanto o usuário utiliza a aplicação.
   *
   * Estados possíveis:
   *
   * verificando: esperando resposta do backend.
   * autenticado: existe uma sessão válida.
   * anonimo: não existe sessão válida.
   * erro: não foi possível consultar o backend.
   */
  const [estado, setEstado] = useState({
    status: "verificando",
    usuario: null,
  });

  /*
   * useCallback mantém a mesma referência da função
   * entre renderizações.
   */
  const revalidar = useCallback(async () => {

    setEstado((estadoAtual) => ({
      ...estadoAtual,
      status: "verificando",
    }));

    try {
      /*
       * O backend é responsável por decidir
       * se a sessão é válida.
       */
      const { data } = await api.get(
        "/usuarios/me",
        {
          /*
           * Evita disparar o evento global durante
           * a própria verificação inicial.
           */
          ignorarEventoSessao: true,
        }
      );

      setEstado({
        status: "autenticado",
        usuario: data,
      });

      return data;

    } catch (erro) {

      /*
       * 401 significa que não existe
       * uma sessão válida.
       */
      if (erro.response?.status === 401) {

        setEstado({
          status: "anonimo",
          usuario: null,
        });

        return null;
      }

      /*
       * Outros erros podem indicar API indisponível,
       * falha de rede ou erro interno.
       */
      setEstado({
        status: "erro",
        usuario: null,
      });

      throw erro;
    }
  }, []);

  /*
   * useEffect executa um efeito depois
   * que o componente é montado.
   *
   * Aqui ele verifica a sessão ao abrir
   * ou atualizar a aplicação.
   */
  useEffect(() => {

    revalidar().catch(() => {
      /*
       * O status "erro" já foi registrado.
       * ProtectedRoute exibirá a mensagem apropriada.
       */
    });

  }, [revalidar]);

  /*
   * Registra o evento global de sessão expirada.
   */
  useEffect(() => {

    const expirarSessao = () => {

      setEstado({
        status: "anonimo",
        usuario: null,
      });
    };

    window.addEventListener(
      "sessao-expirada",
      expirarSessao
    );

    /*
     * A função retornada pelo useEffect é executada
     * quando o componente for desmontado.
     */
    return () => {

      window.removeEventListener(
        "sessao-expirada",
        expirarSessao
      );
    };

  }, []);

  /*
   * Função utilizada pela tela de login.
   */
  const login = useCallback(
    async (email, senha) => {

      /*
       * O JWT será recebido como cookie HttpOnly.
       *
       * O JavaScript não tenta ler a resposta
       * procurando um token.
       */
      await api.post(
        "/usuarios/login",
        {
          email,
          senha,
        }
      );

      /*
       * Confirma que:
       *
       * 1. O navegador aceitou o cookie.
       * 2. O cookie foi enviado para o backend.
       * 3. O backend validou o JWT.
       */
      const { data } = await api.get(
        "/usuarios/me",
        {
          ignorarEventoSessao: true,
        }
      );

      setEstado({
        status: "autenticado",
        usuario: data,
      });

      return data;
    },
    []
  );

  /*
   * Função utilizada para encerrar a sessão.
   */
  const logout = useCallback(async () => {

    /*
     * POST exige o token CSRF, que será adicionado
     * automaticamente pelo interceptor.
     */
    await api.post("/usuarios/logout");

    /*
     * Só limpa o estado depois que o backend
     * confirmou o logout.
     */
    setEstado({
      status: "anonimo",
      usuario: null,
    });

  }, []);

  /*
   * useMemo evita criar um novo objeto em todas
   * as renderizações sem necessidade.
   */
  const valor = useMemo(
    () => ({
      usuario: estado.usuario,
      status: estado.status,

      autenticado:
        estado.status === "autenticado",

      carregando:
        estado.status === "verificando",

      login,
      logout,
      revalidar,
    }),
    [
      estado,
      login,
      logout,
      revalidar,
    ]
  );

  /*
   * Todos os componentes dentro do Provider
   * poderão utilizar useAuth().
   */
  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}

/*
 * Hook personalizado para acessar
 * o contexto de autenticação.
 */
export function useAuth() {

  const contexto = useContext(AuthContext);

  /*
   * Esse erro ajuda a identificar quando useAuth
   * foi utilizado fora do AuthProvider.
   */
  if (!contexto) {
    throw new Error(
      "useAuth precisa estar dentro de <AuthProvider>"
    );
  }

  return contexto;
}