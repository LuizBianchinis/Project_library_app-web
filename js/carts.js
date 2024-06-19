document.addEventListener('DOMContentLoaded', () => {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let cartItemsDiv = document.getElementById('cart-items');

    if (carrinho.length === 0) {
        cartItemsDiv.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
        carrinho.forEach((item, index) => {
            let itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <h2 class="item-title">${item.titulo}</h2>
                <p class="item-price">${item.preco}</p>
                <button class="btn-excluir" onclick="removerDoCarrinho(${index})">Excluir</button>
                <button class="btn-comprar" onclick="abrirModal('${item.titulo}', '${item.preco}')">Comprar</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });
    }
});
function carregarLivros() {
    fetch('http://127.0.0.1:5000/v1/books/query')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os livros');
            }
            return response.json();
        })
        .then(data => {
            const bookCatalog = document.querySelector('.book-catalog');
            bookCatalog.innerHTML = ''; // Limpar o conteúdo existente

            if (Array.isArray(data.data)) {
                data.data.forEach(book => {
                    const bookItem = document.createElement('div');
                    bookItem.classList.add('book-item');
                    bookItem.setAttribute('data-id', book.id);

                    bookItem.innerHTML = `
                        <img src="${book.cover_image}" alt="Capa do livro ${book.title}" style="width:150px;height:auto;">
                        <h2>${book.title}</h2>
                        <p>Autor: ${book.author}</p>
                        <p>Preço: R$ ${book.price}</p>
                        <div class="button-group">
                            <button class="btn-add-cart" id="btn-${book.id}" onclick="adicionarAoCarrinho('${book.title}', 'R$ ${book.price}', '${book.id}')">Carrinho</button>
                            <button class="btn-comprar" onclick="abrirModal('${book.title}', 'R$ ${book.price}')">Comprar</button>
                        </div>

                    `;

                    bookCatalog.appendChild(bookItem);
                });

            } else {
                console.error('Erro ao carregar os livros: Os dados retornados não são um array', data);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar os livros:', error);
            // Tratar erro, se necessário
        });
}

// Inicializar o carregamento dos livros ao carregar a página
carregarLivros();

// Adicionar ao carrinho
function adicionarAoCarrinho(titulo, preco, id) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let btn = document.getElementById('btn-' + id);
    let estoqueAtual = parseInt(btn.getAttribute('data-estoque'));
    let estoque = JSON.parse(localStorage.getItem('estoque')) || {};

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
}
// Adicionar ao carrinho
function adicionarAoCarrinho(titulo, preco, id) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let btn = document.getElementById('btn-' + id);
    let estoqueAtual = parseInt(btn.getAttribute('data-estoque'));
    let estoque = JSON.parse(localStorage.getItem('estoque')) || {};

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
    // Criar elemento para exibir mensagem de confirmação
    let mensagem = document.createElement('div');
    mensagem.textContent = `${titulo} foi adicionado ao carrinho!`;
    mensagem.classList.add('mensagem-carrinho');

    // Adicionar a mensagem ao elemento na página
    let mensagemContainer = document.getElementById('mensagemAdicaocarinho');
    mensagemContainer.innerHTML = ''; // Limpar mensagens anteriores
    mensagemContainer.appendChild(mensagem);
}

