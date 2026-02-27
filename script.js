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

function tamanhoVetor(vetor){
    return vetor.length
}

async function buscarDados(){
    const resposta = await fetch("http://localhost:3000/produtos");
    console.log("resposta", resposta)

    const dadosVisiveis = await resposta.json();
    console.log(tamanhoVetor(dadosVisiveis))
    // console.log("Dados", dadosVisiveis[0].nome);
    
}

buscarDados();