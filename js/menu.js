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
        document.getElementById('novo-estoque-' + id).value = '';
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

document.getElementById('adicionarLivroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const dataPublicacao = document.getElementById('dataPublicacao').value;
    const isbn = document.getElementById('isbn').value;
    const editora = document.getElementById('editora').value;
    const genero = document.getElementById('genero').value;
    const paginas = document.getElementById('paginas').value;
    const idioma = document.getElementById('idioma').value;
    const urlImagem = document.getElementById('urlImagem').value;
    const sumario = document.getElementById('sumario').value;
    const preco = document.getElementById('preco').value;
    const estoque = document.getElementById('estoque').value;

    const bookCatalog = document.getElementById('bookCatalog');
    const newBook = document.createElement('div');
    newBook.classList.add('book-item');

    newBook.innerHTML = `
        <img src="${urlImagem}" alt="Capa do livro '${titulo}'" style="width:150px;height:auto;>
        <h2>${titulo}</h2>
        <p>${autor}</p>
        <p>R$ ${preco}</p>
        <button class="btn-redefinir-estoque" onclick="mostrarCampoRedefinirEstoque('${isbn}')">Redefinir Estoque</button>
        <div class="campo-redefinir" id="campo-redefinir-${isbn}" style="display: none;">
            <input type="number" id="novo-estoque-${isbn}" placeholder="Novo Estoque">
            <button class="btn-confirmar-redefinir" onclick="redefinirEstoque('${isbn}')">Confirmar</button>
        </div>
        <p class="estoque-info" id="estoque-${isbn}" data-id="${isbn}">Estoque: ${estoque}</p>
    `;

    bookCatalog.appendChild(newBook);

    document.getElementById('adicionarLivroForm').reset();
});

// function mostrarCampoRedefinirEstoque(isbn) {
//     document.getElementById(`campo-redefinir-${isbn}`).style.display = 'block';
// }

// function redefinirEstoque(isbn) {
//     const novoEstoque = document.getElementById(`novo-estoque-${isbn}`).value;
//     document.getElementById(`estoque-${isbn}`).innerText = `Estoque: ${novoEstoque}`;
//     document.getElementById(`campo-redefinir-${isbn}`).style.display = 'none';
// }