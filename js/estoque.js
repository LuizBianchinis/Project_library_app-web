document.addEventListener('DOMContentLoaded', () => {

    // Função para selecionar o link do menu
    const menuItem = document.querySelectorAll('.item-menu');

    function selectLink() {
        menuItem.forEach(item => item.classList.remove('ativo'));
        this.classList.add('ativo');
    }

    menuItem.forEach(item => item.addEventListener('click', selectLink));

    // Toggle do menu lateral
    const btnExp = document.querySelector('#btn-exp');
    const menuSide = document.querySelector('.menu-lateral');

    btnExp.addEventListener('click', () => {
        menuSide.classList.toggle('expandir');
    });

    // Função para carregar o estoque dos livros
    function carregarEstoque() {
        let estoque = JSON.parse(localStorage.getItem('estoque')) || {};

        document.querySelectorAll('[id^="estoque-"]').forEach(item => {
            let id = item.getAttribute('data-id');
            let estoqueAtual = estoque[id] !== undefined ? estoque[id] : parseInt(item.innerText.split(': ')[1]);
            item.innerText = 'Estoque: ' + estoqueAtual;
        });
    }

    // Função para carregar o estoque para administração
    function carregarEstoqueAdmin() {
        let estoque = JSON.parse(localStorage.getItem('estoque')) || {};

        document.querySelectorAll('.book-item .estoque-info').forEach(item => {
            let id = item.getAttribute('data-id');
            if (estoque[id] !== undefined) {
                item.innerText = 'Estoque: ' + estoque[id];
                let btn = document.getElementById('btn-redefinir-' + id);
                if (btn) {
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
            }
        });
    }

    // Mostrar campo para redefinir estoque
    function mostrarCampoRedefinirEstoque(id) {
        let campoRedefinir = document.getElementById('campo-redefinir-' + id);
        if (campoRedefinir) {
            campoRedefinir.style.display = 'block';
        }
    }

    // Redefinir estoque de um livro
    async function redefinirEstoque(id) {
        let novoEstoqueElem = document.getElementById('novo-estoque-' + id);
        if (novoEstoqueElem) {
            let novoEstoque = parseInt(novoEstoqueElem.value);
            if (!isNaN(novoEstoque) && novoEstoque >= 0) {
                try {
                    let response = await fetch(`http://127.0.0.1:5000/v1/books/${id}/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ stock: novoEstoque })
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao atualizar o estoque no backend');
                    }

                    let estoque = JSON.parse(localStorage.getItem('estoque')) || {};
                    estoque[id] = novoEstoque;
                    localStorage.setItem('estoque', JSON.stringify(estoque));

                    document.getElementById('estoque-' + id).innerText = 'Estoque: ' + novoEstoque;
                    let btn = document.getElementById('btn-redefinir-' + id);
                    if (btn) {
                        btn.setAttribute('data-estoque', novoEstoque);

                        if (novoEstoque === 0) {
                            btn.disabled = false;
                            btn.innerText = 'Redefinir Estoque';
                            btn.classList.remove('esgotado');
                        }
                    }

                    document.getElementById('campo-redefinir-' + id).style.display = 'none';
                    novoEstoqueElem.value = '';
                } catch (error) {
                    console.error('Erro ao atualizar o estoque:', error);
                }
            }
        }
    }

    // Excluir um livro
    async function excluirLivro(id) {
        try {
            let response = await fetch(`http://127.0.0.1:5000/v1/books/${id}/delete`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir o livro no backend');
            }

            let estoque = JSON.parse(localStorage.getItem('estoque')) || {};
            delete estoque[id];
            localStorage.setItem('estoque', JSON.stringify(estoque));

            document.querySelector('.book-item[data-id="' + id + '"]').remove();
        } catch (error) {
            console.error('Erro ao excluir o livro:', error);
        }
    }

    // Carregar livros do backend e renderizar na página
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
                            <p>${book.author}</p>
                            <p>R$ ${book.price}</p>
                            <button class="btn-redefinir-estoque" data-id="${book.id}">Redefinir Estoque</button>
                            <div class="campo-redefinir" id="campo-redefinir-${book.id}" style="display: none;">
                                <input type="number" id="novo-estoque-${book.id}" placeholder="Novo Estoque">
                                <button class="btn-confirmar-redefinir">Confirmar</button>
                            </div>
                            <p class="estoque-info" id="estoque-${book.id}" data-id="${book.id}">Estoque: ${book.stock}</p>
                            <button class="btn-excluir-livro" data-id="${book.id}">Excluir Livro</button>
                        `;

                        bookCatalog.appendChild(bookItem);
                    });
                    carregarEstoque();
                    carregarEstoqueAdmin();
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

    // Evento delegado para esconder campos de redefinição ao clicar fora deles
    document.addEventListener('click', function(event) {
        let elementosOcultaveis = document.querySelectorAll('[id^="campo-redefinir-"]');

        elementosOcultaveis.forEach(function(elemento) {
            if (!elemento.contains(event.target) && !event.target.matches('[id^="btn-redefinir-"], [id^="novo-estoque-"]')) {
                elemento.style.display = 'none';
            }
        });
    });

    // Evento delegado para redefinir estoque e excluir livro
    document.addEventListener('click', function(event) {
        if (event.target.matches('.btn-redefinir-estoque')) {
            let id = event.target.getAttribute('data-id');
            mostrarCampoRedefinirEstoque(id);
        } else if (event.target.matches('.btn-confirmar-redefinir')) {
            let id = event.target.parentNode.getAttribute('id').replace('campo-redefinir-', '');
            redefinirEstoque(id);
        } else if (event.target.matches('.btn-excluir-livro')) {
            let id = event.target.getAttribute('data-id');
            excluirLivro(id);
        }
    });
});
