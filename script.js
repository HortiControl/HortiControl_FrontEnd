const modal = document.getElementById("modal");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnCancelar = document.getElementById("btnCancelar");
const btnClose = document.getElementById("btnClose");
const modalTitle = document.getElementById("modalTitle");

btnAdicionar.addEventListener("click", () => {
    modalTitle.textContent = "Adicionar Produto";
    modal.style.display = "flex";
});

function fecharModal() {
    modal.style.display = "none";
}

btnCancelar.addEventListener("click", fecharModal);
btnClose.addEventListener("click", fecharModal);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});

function tamanhoVetor(vetor) {
    return vetor.length
}

// function formatarMoeda(valor){
//     let valorFormato = valor;
//     if(/[,.]/.test(valor)){
//         valorFormato = valor.replace(/\,/, ".")
//     }else{
//         valorFormato+= ".00"
//     }

//     return Number(valorFormato).toFixed(2);
// }

async function buscarDados() {
    let listaProduto = document.getElementById("listaProdutos")
    listaProduto.innerHTML = "";

    const resposta = await fetch("http://localhost:3000/produtos");
    console.log("resposta", resposta)

    const dados = await resposta.json();
    console.log(tamanhoVetor(dados))
    // console.log("Dados", dados[0].nome);
    qtdProdutos.innerHTML = tamanhoVetor(dados)

    dados.forEach(produto => {
        let corEmbalagem = "";
        let corTipo = "";

        if (produto.embalagem == "Bandeja") {
            corEmbalagem = "bandeja"
        } else if (produto.embalagem == "Pote") {
            corEmbalagem = "pote"
        } else {
            corEmbalagem = "saco"
        }

        if (produto.tipo == "Pré-lavado") {
            corTipo = "preLavado"
        } else {
            corTipo = "naoLavado"
        }

        listaProduto.innerHTML += `
        <tr>
                        <td>${produto.nome}</td>
                        <td><span class="tag ${corTipo}">${produto.tipo}</span></td>
                        <td>${produto.tipoUnidade}</td>
                        <td>${produto.preco}</td>
                        <td><span class="tag ${corEmbalagem}">${produto.embalagem}</span></td>
                        <td class="actions">
                            <button class="btn-edit">✏️</button>
                            <button class="btn-delete">🗑️</button>
                        </td>
                    </tr>
        `
    });

    const btnsEdit = document.querySelectorAll(".btn-edit");
    
    btnsEdit.forEach(btn => {
        btn.addEventListener("click", () => {
            modalTitle.textContent = "Editar Produto";
            modal.style.display = "flex";
        });
    });


}

async function cadastrarProduto() {
    await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome: inputNome.value,
            tipo: selectTipo.value,
            tipoUnidade: selectUnidade.value,
            preco: inputPreco.value,
            embalagem: selectEmbalagem.value,
        })
    });

    buscarDados();
}

async function atualizar() {

}

buscarDados();