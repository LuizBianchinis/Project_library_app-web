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
            const sumario = document.getElementById('sumario').value;
            const urlImagem = document.getElementById('urlImagem').value;
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
                <p><strong>Autor:</strong> ${autor}</p>
                <p><strong>Data de Publicação:</strong> ${dataPublicacao}</p>
                <p><strong>ISBN:</strong> ${isbn}</p>
                <p><strong>Editora:</strong> ${editora}</p>
                <p><strong>Gênero:</strong> ${genero}</p>
                <p><strong>Páginas:</strong> ${paginas}</p>
                <p><strong>Idioma:</strong> ${idioma}</p>
                <p><strong>Sumário:</strong> ${sumario}</p>
                <p><strong>Preço:</strong> R$ ${preco}</p>
                <p><strong>Estoque:</strong> ${estoque}</p>
            `;

            bookCatalog.appendChild(newBook);

            document.getElementById('adicionarLivroForm').reset();
        });
    }
});
