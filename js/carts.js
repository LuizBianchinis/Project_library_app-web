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
             <button class="btn-excluir" onclick="removerDoCarrinho(${index}, '${item.id}')">Excluir</button>
          `;
          cartItemsDiv.appendChild(itemDiv);
      });
  }
});