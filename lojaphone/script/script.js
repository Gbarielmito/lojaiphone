const navbar = document.querySelector(".navbar");
const menuButton = document.querySelector(".menu-button");


navbar.classList.remove("show-menu");

menuButton.addEventListener("click", () => {
    navbar.classList.toggle("show-menu");
});

// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    const items = document.querySelectorAll('.carrinho-item');
    const contador = document.querySelector('.nav-icon-container a');
    const quantidadeItens = items.length;
    
    // Salva a quantidade no localStorage
    localStorage.setItem('quantidadeCarrinho', quantidadeItens);
    
    if (quantidadeItens > 0) {
      // Cria ou atualiza o contador
      let badge = contador.querySelector('.carrinho-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'carrinho-badge';
        contador.appendChild(badge);
      }
      badge.textContent = quantidadeItens;
    } else {
      // Remove o contador se não houver itens
      const badge = contador.querySelector('.carrinho-badge');
      if (badge) {
        badge.remove();
      }
    }
}

// Função para carregar o contador do localStorage
function carregarContadorCarrinho() {
    const contador = document.querySelector('.nav-icon-container a');
    const quantidadeItens = parseInt(localStorage.getItem('quantidadeCarrinho')) || 0;
    
    if (quantidadeItens > 0) {
        let badge = contador.querySelector('.carrinho-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'carrinho-badge';
            contador.appendChild(badge);
        }
        badge.textContent = quantidadeItens;
    } else {
        // Remove o contador se não houver itens
        const badge = contador.querySelector('.carrinho-badge');
        if (badge) {
            badge.remove();
        }
        // Garante que o localStorage esteja limpo
        localStorage.removeItem('quantidadeCarrinho');
    }
}

// Atualiza o contador quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    carregarContadorCarrinho();
});