fetch('http://127.0.0.1:5000/v1/books/query')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar os livros');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Verificar o conteúdo de data recebido da API

        if (Array.isArray(data)) {
            const bookCatalog = document.querySelector('.book-catalog');
            bookCatalog.innerHTML = ''; // Limpar o conteúdo existente

            data.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');

                // Construir o HTML para cada livro dinamicamente
                bookItem.innerHTML = `
                    <img src="${book.image}" alt="Capa do livro ${book.title}" style="width:150px;height:auto;">
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
            console.error('Os dados recebidos não são um array:', data);
        }
    })
    .catch(error => {
        console.error('Erro ao carregar os livros:', error);
        // Tratar erro, se necessário
    });


// Função para atualizar o livro
function atualizarLivro(event) {
    event.preventDefault(); // Evitar o comportamento padrão do formulário

    var form = document.getElementById('atualizar_livro');
    var livroId = document.getElementById('book-id').value;

    fetch(`http://127.0.0.1:5000/v1/books/<book_id>/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: document.getElementById('book-title').value,
            author: document.getElementById('book-author').value,
            price: document.getElementById('book-price').value
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar o livro');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message); // Mensagem de sucesso do backend
        // Aqui você pode adicionar lógica adicional após a atualização, se necessário
        // Por exemplo, redirecionar de volta para a página de estoque
        window.location.href = 'estoque.html';
    })
    .catch(error => {
        console.error('Erro ao atualizar o livro:', error);
        // Tratar erro, se necessário
    });
}
