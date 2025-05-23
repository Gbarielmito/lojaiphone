// Função para inicializar o carrinho
function inicializarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    atualizarContadorCarrinho();
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(nome, preco, cor) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    const produto = {
        nome: nome,
        preco: preco,
        cor: cor,
        quantidade: 1
    };
    
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    atualizarContadorCarrinho();
    mostrarMensagemAdicionado();
}

// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const contador = document.getElementById('carrinho-contador');
    if (contador) {
        contador.textContent = carrinho.length;
    }
}

// Função para mostrar mensagem de produto adicionado
function mostrarMensagemAdicionado() {
    const mensagem = document.createElement('div');
    mensagem.className = 'mensagem-adicionado';
    mensagem.textContent = 'Produto adicionado ao carrinho!';
    document.body.appendChild(mensagem);
    
    setTimeout(() => {
        mensagem.remove();
    }, 2000);
}

// Inicializar o carrinho quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarCarrinho); 