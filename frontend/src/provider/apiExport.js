import axios from "axios";

const apiExport = axios.create({
    // baseURL: "https://horticontrol-export.onrender.com"
    baseURL: "http://localhost:8081",
    withCredentials: true,
});

/*
 * O cookie CSRF do microsserviço é httpOnly, então o JavaScript não
 * consegue lê-lo. O valor vem por GET /csrf, que também informa qual
 * header usar — assim o nome não fica duplicado aqui.
 *
 * Não dá pra guardar o token em memória: o servidor troca o cookie depois
 * do POST, aí um token reaproveitado volta 403. Por isso buscamos sempre.
 */
async function obterCsrf() {
    const { data } = await apiExport.get("/csrf");

    return {
        token: data?.token,
        headerName: data?.headerName ?? "X-XSRF-TOKEN-EXPORTACAO",
    };
}

// Só o POST /exportacoes altera estado; os demais endpoints são GET.
apiExport.interceptors.request.use(async (config) => {
    const metodo = (config.method || "get").toLowerCase();

    if (metodo === "post") {
        const { token, headerName } = await obterCsrf();

        if (token) {
            config.headers[headerName] = token;
        }
    }

    return config;
});

// Se mesmo assim der 403, tenta mais uma vez com um token novo.
apiExport.interceptors.response.use(
    (response) => response,
    (error) => {
        const requisicao = error.config;

        if (error.response?.status === 403 && requisicao && !requisicao._repetida) {
            requisicao._repetida = true;
            return apiExport(requisicao);
        }

        return Promise.reject(error);
    }
);

export default apiExport;
