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
          <h2>${item.titulo}</h2>
          <p>${item.preco}</p>
          <button onclick="removerDoCarrinho(${index})">Excluir</button>
        `;
        cartItemsDiv.appendChild(itemDiv);
      });
    }
  });