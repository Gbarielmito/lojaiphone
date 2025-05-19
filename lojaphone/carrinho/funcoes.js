function aumentarQuantidade(button) {
    const quantidadeElement = button.previousElementSibling;
    let quantidade = parseInt(quantidadeElement.textContent);
    quantidadeElement.textContent = quantidade + 1;
    atualizarTotal();
    
    // Adiciona animação
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 200);
  }

  function diminuirQuantidade(button) {
    const quantidadeElement = button.nextElementSibling;
    let quantidade = parseInt(quantidadeElement.textContent);
    if (quantidade > 1) {
      quantidadeElement.textContent = quantidade - 1;
      atualizarTotal();
      
      // Adiciona animação
      button.classList.add('clicked');
      setTimeout(() => button.classList.remove('clicked'), 200);
    }
  }

  function removerItem(button) {
    const item = button.closest('.carrinho-item');
    item.classList.add('removing');
    
    setTimeout(() => {
      item.remove();
      atualizarTotal();
    }, 300);
  }

  function atualizarTotal() {
    const items = document.querySelectorAll('.carrinho-item');
    let total = 0;
    
    items.forEach(item => {
      const preco = parseFloat(item.querySelector('.carrinho-item-preco').textContent.replace('R$ ', '').replace('.', '').replace(',', '.'));
      const quantidade = parseInt(item.querySelector('.carrinho-item-quantidade span').textContent);
      total += preco * quantidade;
    });
    
    // Atualiza o subtotal
    document.querySelector('.total-info:first-child span:last-child').textContent = 
      `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Atualiza o total final
    document.getElementById('total-carrinho').textContent = 
      `${total.toFixed(2).replace('.', ',')}`;
  }

  function finalizarCompra() {
    const items = document.querySelectorAll('.carrinho-item');
    if (items.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    
    // Adiciona animação de loading no botão
    const btnFinalizar = document.querySelector('.btn-finalizar');
    btnFinalizar.innerHTML = '<i class="ri-loader-4-line"></i> Processando...';
    btnFinalizar.disabled = true;
    
    // Simula um processamento e mostra o popup
    setTimeout(() => {
      btnFinalizar.classList.add('success');
      btnFinalizar.innerHTML = 'Finalizar Compra <i class="ri-arrow-right-line"></i>';
      btnFinalizar.disabled = false;
      
      // Mostra o popup de pagamento
      const popup = document.getElementById('popup-pagamento');
      popup.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Previne rolagem
    }, 1000);
  }

  function fecharPopup() {
    const popup = document.getElementById('popup-pagamento');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function selecionarMetodo(elemento) {
    // Remove a seleção de todos os métodos
    document.querySelectorAll('.metodo-pagamento').forEach(metodo => {
      metodo.classList.remove('selected');
    });
    
    // Adiciona a seleção ao método clicado
    elemento.classList.add('selected');
    
    // Mostra/esconde os campos apropriados
    const dadosCartao = document.getElementById('dados-cartao');
    const dadosPix = document.getElementById('dados-pix');
    
    if (elemento.querySelector('p').textContent === 'Cartão de Crédito') {
      dadosCartao.style.display = 'block';
      dadosPix.style.display = 'none';
    } else {
      dadosCartao.style.display = 'none';
      dadosPix.style.display = 'none';
    }
  }

  function iniciarTimerPix() {
    let minutos = 14;
    let segundos = 59;
    
    const timerElement = document.getElementById('pix-timer');
    
    const timer = setInterval(() => {
      if (segundos === 0) {
        if (minutos === 0) {
          clearInterval(timer);
          timerElement.textContent = 'Expirado';
          timerElement.style.color = '#ff4444';
          return;
        }
        minutos--;
        segundos = 59;
      } else {
        segundos--;
      }
      
      timerElement.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }, 1000);
  }

  function copiarPixCode() {
    const pixCode = document.getElementById('pix-code').textContent;
    navigator.clipboard.writeText(pixCode).then(() => {
      const btnCopiar = document.querySelector('.btn-copiar');
      const textoOriginal = btnCopiar.innerHTML;
      btnCopiar.innerHTML = '<i class="ri-check-line"></i> Copiado!';
      btnCopiar.style.background = '#4CAF50';
      
      setTimeout(() => {
        btnCopiar.innerHTML = textoOriginal;
        btnCopiar.style.background = '#0084ff';
      }, 2000);
    });
  }

  // Adiciona máscara para CPF
  document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      e.target.value = value;
    }
  });

  // Adiciona máscara para número do cartão
  document.getElementById('numero-cartao').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      value = value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
      e.target.value = value;
    }
  });

  // Adiciona máscara para validade
  document.getElementById('validade').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      value = value.replace(/(\d{2})(\d{2})/, '$1/$2');
      e.target.value = value;
    }
  });

  // Adiciona máscara para CVV
  document.getElementById('cvv').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3);
    }
    e.target.value = value;
  });

  // Adiciona máscara para CEP
  document.getElementById('cep').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
      e.target.value = value;
    }
  });

  // Busca endereço pelo CEP
  document.getElementById('cep').addEventListener('blur', function(e) {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            document.getElementById('cidade').value = data.localidade;
            document.getElementById('rua').value = data.logradouro;
          }
        })
        .catch(error => console.error('Erro ao buscar CEP:', error));
    }
  });

  // Manipula o envio do formulário
  document.getElementById('form-pagamento').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btnConfirmar = document.querySelector('.btn-confirmar');
    btnConfirmar.innerHTML = '<i class="ri-loader-4-line"></i> Processando...';
    btnConfirmar.disabled = true;
    
    // Desabilita todos os campos do formulário
    const form = document.getElementById('form-pagamento');
    const inputs = form.querySelectorAll('input');
    const metodosPagamento = form.querySelectorAll('.metodo-pagamento');
    
    inputs.forEach(input => {
      input.disabled = true;
      input.style.backgroundColor = '#f5f5f5';
      input.style.cursor = 'not-allowed';
    });
    
    metodosPagamento.forEach(metodo => {
      metodo.style.pointerEvents = 'none';
      metodo.style.opacity = '0.7';
    });
    
    // Verifica qual método de pagamento está selecionado
    const metodoSelecionado = document.querySelector('.metodo-pagamento.selected p').textContent;
    
    if (metodoSelecionado === 'PIX') {
      // Mostra o QR Code do PIX
      const dadosPix = document.getElementById('dados-pix');
      dadosPix.style.display = 'block';
      iniciarTimerPix();
      
      // Esconde o botão de confirmar e mostra mensagem
      btnConfirmar.style.display = 'none';
      const mensagemPix = document.createElement('div');
      mensagemPix.className = 'mensagem-pix';
      mensagemPix.innerHTML = `
        <p>Escaneie o QR Code ou copie o código PIX para realizar o pagamento</p>
        <p>Após o pagamento, você receberá um e-mail com a confirmação</p>
      `;
      dadosPix.insertBefore(mensagemPix, dadosPix.firstChild);
    } else {
      // Simula o processamento do pagamento para outros métodos
      setTimeout(() => {
        alert('Pagamento realizado com sucesso!');
        window.location.href = '../index.html';
      }, 2000);
    }
  });

  // Fecha o popup ao clicar fora dele
  document.getElementById('popup-pagamento').addEventListener('click', function(e) {
    if (e.target === this) {
      fecharPopup();
    }
  });

  // Adiciona efeito de hover nos botões
  document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-2px)';
      });
      button.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  });

  // Funções do Carrossel
  document.addEventListener('DOMContentLoaded', function() {
    const carrossel = document.querySelector('.carrossel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carrossel-dots');
    const cards = document.querySelectorAll('.produto-card');
    
    let currentIndex = 0;
    const cardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const totalSlides = Math.ceil(cards.length / cardsPerView);
    
    // Criar dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    function updateCarrossel() {
        const offset = currentIndex * -100;
        carrossel.style.transform = `translateX(${offset}%)`;
        
        // Atualizar dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Atualizar estado dos botões
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.5' : '1';
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarrossel();
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarrossel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateCarrossel();
        }
    });
    
    // Atualizar carrossel quando a janela for redimensionada
    window.addEventListener('resize', () => {
        const newCardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
        if (newCardsPerView !== cardsPerView) {
            location.reload();
        }
    });
    
    // Inicializar carrossel
    updateCarrossel();
  });