const modal = document.getElementById("modal");
const btnAdicionar = document.getElementById("btnAdicionar");
const btnCancelar = document.getElementById("btnCancelar");
const btnClose = document.getElementById("btnClose");
const modalTitle = document.getElementById("modalTitle");
const btnsEdit = document.querySelectorAll(".btn-edit");

// Abrir como adicionar
btnAdicionar.addEventListener("click", () => {
    modalTitle.textContent = "Adicionar Produto";
    modal.style.display = "flex";
});

// Abrir como editar
btnsEdit.forEach(btn => {
    btn.addEventListener("click", () => {
        modalTitle.textContent = "Editar Produto";
        modal.style.display = "flex";
    });
});

// Fechar modal
function fecharModal() {
    modal.style.display = "none";
}

btnCancelar.addEventListener("click", fecharModal);
btnClose.addEventListener("click", fecharModal);

// Fechar clicando fora
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});

function tamanhoVetor(vetor) {
    return vetor.length
}



async function buscarDados() {
    const resposta = await fetch("http://localhost:3000/produtos");
    console.log("resposta", resposta)

    const dados = await resposta.json();
    console.log(tamanhoVetor(dados))
    // console.log("Dados", dados[0].nome);
    qtdProdutos.innerHTML = tamanhoVetor(dados)
}

async function adicionar() {
    await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome: input_nome.value,
        }),
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

buscarDados();