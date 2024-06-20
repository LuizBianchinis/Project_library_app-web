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
                <button class="btn-comprar" onclick="abrirModal('${item.titulo}', '${item.preco}','${item.id}')">Comprar</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });
    }
});

function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let itemRemovido = carrinho.splice(index, 1)[0];
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    if (itemRemovido && itemRemovido.id) {
        let estoque = JSON.parse(localStorage.getItem('estoque')) || {};
        estoque[itemRemovido.id] = (estoque[itemRemovido.id] || 0) + 1;
        localStorage.setItem('estoque', JSON.stringify(estoque));

        let btn = document.getElementById('btn-' + itemRemovido.id);
        if (btn) {
            btn.setAttribute('data-estoque', estoque[itemRemovido.id]);
            document.getElementById('estoque-' + itemRemovido.id).innerText = 'Estoque: ' + estoque[itemRemovido.id];
            btn.disabled = false;
            btn.innerText = 'Adicionar ao Carrinho';
            btn.classList.remove('esgotado');
        }
    }

    // Atualizar a exibição do carrinho sem recarregar a página
    atualizarCarrinho();
}

function atualizarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

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
                <button class="btn-comprar" onclick="abrirModal('${item.titulo}', '${item.preco}','${item.id}')">Comprar</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });
    }
}
