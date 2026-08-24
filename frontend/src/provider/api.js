import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "VITE_API_URL não foi configurada. Crie o arquivo .env.local na raiz do frontend."
  );
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
/*
 * Estes métodos devem apenas consultar dados.
 *
 * Por isso não precisam do token CSRF.
 */
const METODOS_SEGUROS = new Set([
  "GET",
  "HEAD",
  "OPTIONS",
]);

/*
 * Token CSRF mantido somente na memória.
 *
 * Quando a página for fechada ou atualizada,
 * este valor será perdido.
 */
let csrfAtual = null;

/*
 * Guarda uma requisição de CSRF em andamento.
 *
 * Isso evita que várias chamadas simultâneas
 * executem vários GET /csrf.
 */
let requisicaoCsrf = null;

/*
 * Busca um token CSRF no backend.
 */
async function obterCsrf() {

  /*
   * Reutiliza o token se ele já foi obtido.
   */
  if (csrfAtual) {
    return csrfAtual;
  }

  /*
   * Só cria uma requisição se não existir
   * outra em andamento.
   */
  if (!requisicaoCsrf) {

    requisicaoCsrf = api

      /*
       * GET é um método seguro e, portanto,
       * não entra em recursão no interceptor.
       */
      .get("/csrf", {
        /*
         * Propriedade personalizada lida pelo
         * interceptor de resposta.
         */
        ignorarEventoSessao: true,
      })

      .then(({ data }) => {

        /*
         * Confirma que o backend enviou
         * as informações esperadas.
         */
        if (!data?.token || !data?.headerName) {
          throw new Error(
            "Resposta CSRF inválida"
          );
        }

        csrfAtual = {
          token: data.token,
          headerName: data.headerName,
        };

        return csrfAtual;
      })

      .finally(() => {
        /*
         * Quando a chamada terminar,
         * outra chamada poderá ser criada.
         */
        requisicaoCsrf = null;
      });
  }

  /*
   * Aguarda a requisição existente.
   */
  return requisicaoCsrf;
}

/*
 * Interceptor executado antes de cada requisição.
 */
api.interceptors.request.use(
  async (config) => {

    /*
     * O Axios normalmente usa métodos em minúsculo.
     * Padronizamos para letras maiúsculas.
     */
    const metodo =
      (config.method ?? "get").toUpperCase();

    /*
     * POST, PUT, PATCH e DELETE entram aqui.
     */
    if (!METODOS_SEGUROS.has(metodo)) {

      const csrf = await obterCsrf();

      /*
       * AxiosHeaders possui o método set
       * nas versões mais recentes do Axios.
       */
      if (
        typeof config.headers?.set === "function"
      ) {
        config.headers.set(
          csrf.headerName,
          csrf.token
        );

      } else {
        /*
         * Compatibilidade para headers
         * representados por um objeto comum.
         */
        config.headers = {
          ...config.headers,
          [csrf.headerName]: csrf.token,
        };
      }
    }

    return config;
  }
);

/*
 * Interceptor executado depois de cada resposta.
 */
api.interceptors.response.use(
  /*
   * Respostas de sucesso são devolvidas
   * sem alteração.
   */
  (resposta) => resposta,

  /*
   * Respostas de erro são tratadas aqui.
   */
  (erro) => {

    const endpoint =
      String(erro.config?.url ?? "");

    /*
     * Um 401 no login normalmente significa
     * credenciais incorretas, não sessão expirada.
     */
    const requisicaoDeLogin =
      endpoint.endsWith("/usuarios/login");

    /*
     * Nas outras rotas, 401 significa que a sessão
     * não é mais válida.
     */
    if (
      erro.response?.status === 401
      && !requisicaoDeLogin
      && !erro.config?.ignorarEventoSessao
    ) {
      /*
       * Dispara um evento que será ouvido
       * pelo AuthContext.
       */
      window.dispatchEvent(
        new Event("sessao-expirada")
      );
    }

    /*
     * Um 403 pode indicar CSRF inválido.
     *
     * Apagamos o token em memória para que
     * a próxima operação obtenha outro.
     */
    if (erro.response?.status === 403) {
      csrfAtual = null;
    }

    /*
     * Mantém o erro disponível para o componente
     * que executou a requisição.
     */
    return Promise.reject(erro);
  }
);

export default api;