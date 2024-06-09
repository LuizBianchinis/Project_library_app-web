// Seleciona os itens clicados
var menuItem = document.querySelectorAll('.item-menu');

function selectLink(){
    menuItem.forEach((item) =>
        item.classList.remove('ativo')
    );
    this.classList.add('ativo');
}

menuItem.forEach((item) =>
    item.addEventListener('click', selectLink)
);

// Expandir o menu
var btnExp = document.querySelector('#btn-exp');
var menuSide = document.querySelector('.menu-lateral');

btnExp.addEventListener('click', function(){
    menuSide.classList.toggle('expandir');
});

// Adicionar ao carrinho
function adicionarAoCarrinho(titulo, preco, id) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let btn = document.getElementById('btn-' + id);
    let estoqueAtual = parseInt(btn.getAttribute('data-estoque'));
    let estoque = JSON.parse(localStorage.getItem('estoque')) || {};
    
    if (estoqueAtual > 0) {
        carrinho.push({ titulo, preco, id });
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        
        estoqueAtual--;
        estoque[id] = estoqueAtual;
        localStorage.setItem('estoque', JSON.stringify(estoque));

        btn.setAttribute('data-estoque', estoqueAtual);
        document.getElementById('estoque-' + id).innerText = 'Estoque: ' + estoqueAtual;

        if (estoqueAtual === 0) {
            btn.disabled = true;
            btn.innerText = 'Esgotado';
            btn.classList.add('esgotado');
        }
    } else {
        alert('Estoque insuficiente!');
    }
}

function removerDoCarrinho(index, id) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  
    if (id) {
        let estoque = JSON.parse(localStorage.getItem('estoque')) || {};
        estoque[id] = (estoque[id] || 0) + 1;
        localStorage.setItem('estoque', JSON.stringify(estoque));
    }
  
    window.location.reload();
  }
  
document.addEventListener('DOMContentLoaded', carregarEstoque);


function carregarEstoque() {
    let estoque = JSON.parse(localStorage.getItem('estoque')) || {};

    document.querySelectorAll('[id^="estoque-"]').forEach(item => {
        let id = item.getAttribute('data-id');
        let estoqueAtual = estoque[id] !== undefined ? estoque[id] : parseInt(item.innerText.split(': ')[1]);
        item.innerText = 'Estoque: ' + estoqueAtual;
        document.getElementById('btn-redefinir-' + id).setAttribute('data-estoque', estoqueAtual);
    });
}

function carregarEstoqueAdmin() {
    let estoque = JSON.parse(localStorage.getItem('estoque')) || {};

    document.querySelectorAll('.book-item .estoque-info').forEach(item => {
        let id = item.getAttribute('data-id');
        if (estoque[id] !== undefined) {
            item.innerText = 'Estoque: ' + estoque[id];
            let btn = document.getElementById('btn-' + id);
            btn.setAttribute('data-estoque', estoque[id]);

            if (estoque[id] === 0) {
                btn.disabled = true;
                btn.innerText = 'Esgotado';
                btn.classList.add('esgotado');
            } else {
                btn.disabled = false;
                btn.innerText = 'Adicionar ao Carrinho';
                btn.classList.remove('esgotado');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', carregarEstoqueAdmin);

function mostrarCampoRedefinirEstoque(id) {
    let campoRedefinir = document.getElementById('campo-redefinir-' + id);
    campoRedefinir.style.display = 'block';
}

function redefinirEstoque(id) {
    let novoEstoque = parseInt(document.getElementById('novo-estoque-' + id).value);
    if (!isNaN(novoEstoque) && novoEstoque >= 0) {
        let estoque = JSON.parse(localStorage.getItem('estoque')) || {};
        estoque[id] = novoEstoque;
        localStorage.setItem('estoque', JSON.stringify(estoque));

        document.getElementById('estoque-' + id).innerText = 'Estoque: ' + novoEstoque;
        let btn = document.getElementById('btn-redefinir-' + id);
        btn.setAttribute('data-estoque', novoEstoque);

        if (novoEstoque === 0) {
            btn.disabled = false;
            btn.innerText = 'Redefinir Estoque';
            btn.classList.remove('esgotado');
        }

        document.getElementById('campo-redefinir-' + id).style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', carregarEstoque);

document.addEventListener('click', function(event) {
    let elementosOcultaveis = document.querySelectorAll('[id^="campo-redefinir-"]');

    elementosOcultaveis.forEach(function(elemento) {
        if (!elemento.contains(event.target) && !event.target.matches('[id^="btn-redefinir-"], [id^="novo-estoque-"]')) {
            elemento.style.display = 'none';
        }
    });
});