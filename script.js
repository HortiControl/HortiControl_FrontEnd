const modal = document.getElementById("modal");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnCancelar = document.getElementById("btnCancelar");
const btnClose = document.getElementById("btnClose");
const modalTitle = document.getElementById("modalTitle");
const btnAction = document.getElementById("btn-action");
var idProdutoGlobal = 0;

btnAdicionar.addEventListener("click", () => {
    modalTitle.textContent = "Adicionar Produto";
    modal.style.display = "flex";
});

function limparFormulario() {
    inputNome.value = "";
    selectTipo.value = "";
    selectEmbalagem.value = "";
    selectUnidade.value = "";
    inputPreco.value = "";
}
function fecharModal() {
    modal.style.display = "none";
    limparFormulario();
}

btnCancelar.addEventListener("click", fecharModal);
btnClose.addEventListener("click", fecharModal);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});

function teste() {
    console.log("pábens")
}
btnAction.addEventListener("click", () => {
    if (modalTitle.textContent == "Adicionar Produto") {
        cadastrarProduto();
    } else {
        atualizarProduto(idProdutoGlobal);
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
                            <button class="btn-edit" data-id = "${produto.id}">✏️</button>
                            <button class="btn-delete" data-id = "${produto.id}">🗑️</button>
                        </td>
                    </tr>
        `
    });

    const btnsEdit = document.querySelectorAll(".btn-edit");
    const btnsDelete = document.querySelectorAll(".btn-delete");
    btnsDelete.forEach(btn => {
        btn.addEventListener("click", () => {
            let id = btn.dataset.id;
            onclick = deletarProduto(id);
        });
    });

    btnsEdit.forEach(btn => {
        btn.addEventListener("click", () => {
            let id = btn.dataset.id;
            modalTitle.textContent = "Editar Produto";
            modal.style.display = "flex";
            onclick = exibirDadosModal(id);
        });
    });
}

async function exibirDadosModal(idRecebido) {
    const resposta = await fetch(`http://localhost:3000/produtos/${idRecebido}`);
    const produto = await resposta.json();

    inputNome.value = produto.nome;
    selectTipo.value = produto.tipo;
    selectEmbalagem.value = produto.embalagem;
    selectUnidade.value = produto.tipoUnidade;
    inputPreco.value = produto.preco;
    idProdutoGlobal = produto.id;
}

async function deletarProduto(idRecebido) {
    await fetch(`http://localhost:3000/produtos/${idRecebido}`, {
        method: "DELETE"
    })
    
    buscarDados();
}

async function atualizarProduto(idRecebido) {
    await fetch(`http://localhost:3000/produtos/${idRecebido}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
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


buscarDados();