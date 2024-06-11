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

function addBook() {
    var title = document.getElementById('book-title').value;
    var author = document.getElementById('book-author').value;
    var publication_date = document.getElementById('publication_date').value;
    var isbn = document.getElementById('book-isbn').value;
    var publisher = document.getElementById('book-publisher').value;
    var genre = document.getElementById('book-genre').value;
    var pages = document.getElementById('book-pages').value;
    var language = document.getElementById('book-language').value;
    var summary = document.getElementById('book-summary').value;
    var price = document.getElementById('book-price').value;
    var image = document.getElementById('book-image').value;

    var bookId = title.toLowerCase().replace(/ /g, '-');

    var newBookHTML = `
        <div class="book-item">
            <img src="${image}" alt="Capa do livro '${title}'" style="width:150px;height:auto;">
            <h2>${title}</h2>
            <p>${author}</p>
            <p>R$ ${price}</p>
            <button class="btn-redefinir-estoque" id="btn-redefinir-${bookId}" data-id="${bookId}" onclick="mostrarCampoRedefinirEstoque('${bookId}')">Redefinir Estoque</button>
            <div class="campo-redefinir" id="campo-redefinir-${bookId}" style="display: none;">
                <input type="number" id="novo-estoque-${bookId}" placeholder="Novo Estoque">
                <button class="btn-confirmar-redefinir" onclick="redefinirEstoque('${bookId}')">Confirmar</button>
            </div>
            <p class="estoque-info" id="estoque-${bookId}" data-id="${bookId}">Estoque: ${stock}</p>
        </div>
    `;

    document.getElementById('book-catalog').insertAdjacentHTML('beforeend', newBookHTML);

    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('publication_date').value = '';
    document.getElementById('book-isbn').value = '';
    document.getElementById('book-publisher').value = '';
    document.getElementById('book-genre').value = '';
    document.getElementById('book-pages').value = '';
    document.getElementById('book-language').value = '';
    document.getElementById('book-summary').value = '';
    document.getElementById('book-price').value = '';
    document.getElementById('book-image').value = '';
}

document.querySelector('.botao-adicionar').addEventListener('click', addBook);