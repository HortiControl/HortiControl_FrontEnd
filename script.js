const modal = document.getElementById("modal");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnCancelar = document.getElementById("btnCancelar");
const btnClose = document.getElementById("btnClose");
const modalTitle = document.getElementById("modalTitle");
const btnAction = document.getElementById("btn-action");
let idProdutoGlobal = 0;

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

function isInputVazio(modalRecebido) {
    let inputsAll = modalRecebido.querySelectorAll(".type-input");

    for (let input of inputsAll) {
        if (input.value == null || input.value == "") {
            return true;
        }
        return false;
    }
}

function fecharModal(modalRecebido) {
    modalRecebido.style.display = "none";
    limparFormulario();
}

btnCancelar.addEventListener("click",() => fecharModal(modal));
btnClose.addEventListener("click", () => fecharModal(modal));

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        fecharModal(modal);
    }
});

btnAction.addEventListener("click", () => {
    if (modalTitle.textContent == "Adicionar Produto") {
        cadastrarProduto();
    } else {
        atualizarProduto(idProdutoGlobal);
    }
});

function formatarMoeda(valor) {
    let valorFormato = valor;
    if (/[,.]/.test(valor)) {
        valorFormato = valor.replace(/\,/, ".")
    } else {
        valorFormato += ".00"
    }

    return Number(valorFormato).toFixed(2);
}

function definirCordEmbalagem(embalagem) {
    switch (embalagem) {
        case "Bandeja":
            return "bandeja";
        case "Pote":
            return "pote";
        case "Saco":
            return "saco";
    }
}

function definirCorTipo(tipo) {
    switch (tipo) {
        case "Pré-lavado":
            return "preLavado";

        case "Não lavado":
            return "naoLavado";
    }
}

async function buscarDados() {
    let listaProduto = document.getElementById("listaProdutos")
    listaProduto.innerHTML = "";

    const resposta = await fetch("http://localhost:3000/produtos");
    console.log("resposta", resposta)

    const dados = await resposta.json();
    qtdProdutos.innerHTML = dados.length;

    dados.forEach(produto => {
        listaProduto.innerHTML += `
        <tr>
                        <td>${produto.nome}</td>
                        <td><span class="tag ${definirCorTipo(produto.tipo)}">${produto.tipo}</span></td>
                        <td>${produto.tipoUnidade}</td>
                        <td>${produto.preco}</td>
                        <td><span class="tag ${definirCordEmbalagem(produto.embalagem)}">${produto.embalagem}</span></td>
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
    fecharModal(modal);
}

async function cadastrarProduto() {
    if (isInputVazio(modal)) {
        alert("Preencha tudo")
    } else {
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
        fecharModal(modal);
    }
}

buscarDados();