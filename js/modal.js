// Script para abrir e fechar o modal
document.addEventListener('DOMContentLoaded', (event) => {
    var modal = document.getElementById("modalPagamento");
    var btnCancelar = document.querySelector(".btn.cancelar");
    var spanClose = document.getElementsByClassName("close")[0];

    // Quando o usuário clicar em "Cancelar", fecha o modal
    btnCancelar.onclick = function() {
        modal.style.display = "none";
    }

    // Quando o usuário clicar no <span> (x), fecha o modal
    spanClose.onclick = function() {
        modal.style.display = "none";
    }

    // Quando o usuário clicar fora do modal, fecha o modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

// Função para abrir o modal
function abrirModalPagamento() {
    var modal = document.getElementById("modalPagamento");
    modal.style.display = "block";
}
