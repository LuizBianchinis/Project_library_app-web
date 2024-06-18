document.addEventListener('DOMContentLoaded', () => {
// Seleciona os itens clicados
    const menuItem = document.querySelectorAll('.item-menu');

    function selectLink() {
        menuItem.forEach(item => item.classList.remove('ativo'));
        this.classList.add('ativo');
    }

    menuItem.forEach(item => item.addEventListener('click', selectLink));

    // Expandir o menu
    const btnExp = document.querySelector('#btn-exp');
    const menuSide = document.querySelector('.menu-lateral');

    btnExp.addEventListener('click', () => {
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
                let btn = document.getElementById('btn-redefinir-' + id);
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

    document.addEventListener('DOMContentLoaded', carregarEstoqueAdmin);

    document.addEventListener('click', function(event) {
        let elementosOcultaveis = document.querySelectorAll('[id^="campo-redefinir-"]');

        elementosOcultaveis.forEach(function(elemento) {
            if (!elemento.contains(event.target) && !event.target.matches('[id^="btn-redefinir-"], [id^="novo-estoque-"]')) {
                elemento.style.display = 'none';
            }
        });
    });

    const adicionarLivroForm = document.getElementById('adicionarLivroForm');
    if (adicionarLivroForm) {
        adicionarLivroForm.addEventListener('submit', function(event) {
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

            fetch('http://127.0.0.1:5000/v1/books/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: titulo,
                    author: autor,
                    publication_date: dataPublicacao,
                    isbn: isbn,
                    publisher: editora,
                    genre: genero,
                    page_count: paginas,
                    language: idioma,
                    summary: sumario,
                    cover_image: urlImagem,
                    price: preco,
                    stock: estoque
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status_code === 200) {
                    alert('Livro adicionado com sucesso!');
                    location.reload();
                } else {
                    alert('Erro ao adicionar livro: ' + data.message);
                }
            })
            .catch(error => console.error('Erro:', error));

            const bookCatalog = document.getElementById('bookCatalog');
            const newBook = document.createElement('div');
            newBook.classList.add('book-item');

            newBook.innerHTML = `
                <img src="${urlImagem}" alt="Capa do livro '${titulo}'" style="width:150px;height:auto;">
                <h2>${titulo}</h2>
                <p>${autor}</p>
                <p>R$ ${preco}</p>
                <button class="btn-redefinir-estoque" id="btn-redefinir-${isbn}" data-estoque="${estoque}" onclick="mostrarCampoRedefinirEstoque('${isbn}')">Redefinir Estoque</button>
                <div class="campo-redefinir" id="campo-redefinir-${isbn}" style="display: none;">
                    <input type="number" id="novo-estoque-${isbn}" placeholder="Novo Estoque">
                    <button class="btn-confirmar-redefinir" onclick="redefinirEstoque('${isbn}')">Confirmar</button>
                </div>
                <p class="estoque-info" id="estoque-${isbn}" data-id="${isbn}">Estoque: ${estoque}</p>
            `;

            bookCatalog.appendChild(newBook);

            document.getElementById('adicionarLivroForm').reset();
        });
    }

        // Função para carregar os livros do backend e renderizar na página
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
    
                    if (Array.isArray(data)) {
                        data.forEach(book => {
                            const bookItem = document.createElement('div');
                            bookItem.classList.add('book-item');
    
                            bookItem.innerHTML = `
                                <img src="${book.cover_image}" alt="Capa do livro ${book.title}" style="width:150px;height:auto;">
                                <h2>${book.title}</h2>
                                <p>${book.author}</p>
                                <p>R$ ${book.price}</p>
                                <button class="btn-redefinir-estoque" data-id="${book.id}" onclick="mostrarCampoRedefinirEstoque('${book.id}')">Redefinir Estoque</button>
                                <div class="campo-redefinir" id="campo-redefinir-${book.id}" style="display: none;">
                                    <input type="number" id="novo-estoque-${book.id}" placeholder="Novo Estoque">
                                    <button class="btn-confirmar-redefinir" onclick="redefinirEstoque('${book.id}')">Confirmar</button>
                                </div>
                                <p class="estoque-info" id="estoque-${book.id}" data-id="${book.id}">Estoque: ${book.stock}</p>
                                <a href="atualizar_livro.html?id=${book.id}" class="btn-atualizar-livro">Atualizar Livro</a>
                                <button class="btn-excluir-livro" data-id="${book.id}" onclick="excluirLivro('${book.id}')">Excluir Livro</button>
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
<<<<<<< HEAD
    
        // Chamada inicial para carregar os livros ao carregar a página
        carregarLivros();
    });
=======
    })
    .catch(error => console.error('Erro:', error));
});
>>>>>>> 01b786c61575bb14258096906dc85061162cbbf3
