import api from "../provider/api";

export function buscarResultados(periodo) {
  return api
    .get(`/resultados?periodo=${periodo}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data);
}
