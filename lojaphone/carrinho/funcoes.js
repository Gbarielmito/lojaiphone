// Adiciona array global para armazenar pedidos confirmados
let pedidosConfirmados = [];

function aumentarQuantidade(button) {
    const quantidadeElement = button.previousElementSibling;
    let quantidade = parseInt(quantidadeElement.textContent);
    quantidadeElement.textContent = quantidade + 1;
    atualizarTotal();
    salvarCarrinho();
    
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
      salvarCarrinho();
      
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
      atualizarContadorCarrinho();
      salvarCarrinho();
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

    // Atualiza o contador do carrinho
    atualizarContadorCarrinho();
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
      document.body.style.overflow = 'hidden';
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
    // Remove tudo que não for número
    let value = e.target.value.replace(/\D/g, '');
    
    // Limita a exatamente 11 dígitos
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    // Aplica a máscara do CPF (000.000.000-00)
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
    }
    
    e.target.value = value;
  });

  // Validação do nome do titular
  document.getElementById('nome-titular').addEventListener('input', function(e) {
    // Remove apenas números e caracteres especiais, mantendo acentos e espaços
    let value = e.target.value.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
    e.target.value = value;
  });

  // Validação do número do cartão
  document.getElementById('numero-cartao').addEventListener('input', function(e) {
    // Remove tudo que não for número
    let value = e.target.value.replace(/\D/g, '');
    
    // Limita a exatamente 16 dígitos
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
    
    // Adiciona espaço a cada 4 dígitos
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;

    // Adiciona classe de validação visual
    if (value.replace(/\s/g, '').length === 16) {
      e.target.classList.add('valid');
      e.target.classList.remove('invalid');
    } else {
      e.target.classList.add('invalid');
      e.target.classList.remove('valid');
    }
  });

  // Validação da validade
  document.getElementById('validade').addEventListener('input', function(e) {
    // Remove tudo que não for número
    let value = e.target.value.replace(/\D/g, '');
    
    // Limita a exatamente 4 dígitos
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    
    // Adiciona barra após os primeiros 2 dígitos
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    // Validação do mês (01-12)
    const mes = parseInt(value.slice(0, 2));
    if (mes > 12) {
      value = '12' + value.slice(2);
    }
    
    e.target.value = value;

    // Adiciona classe de validação visual
    if (value.replace(/\D/g, '').length === 4) {
      e.target.classList.add('valid');
      e.target.classList.remove('invalid');
    } else {
      e.target.classList.add('invalid');
      e.target.classList.remove('valid');
    }
  });

  // Validação do CVV
  document.getElementById('cvv').addEventListener('input', function(e) {
    // Remove tudo que não for número
    let value = e.target.value.replace(/\D/g, '');
    // Limita a 3 dígitos
    if (value.length > 3) {
      value = value.slice(0, 3);
    }
    e.target.value = value;

    // Adiciona classe de validação visual
    if (value.length === 3) {
      e.target.classList.add('valid');
      e.target.classList.remove('invalid');
    } else {
      e.target.classList.add('invalid');
      e.target.classList.remove('valid');
    }
  });

  // Adiciona máscara para CEP
  document.getElementById('cep').addEventListener('input', function(e) {
    // Remove tudo que não for número
    let value = e.target.value.replace(/\D/g, '');
    
    // Limita a exatamente 8 dígitos
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    
    // Aplica a máscara do CEP (00000-000)
    if (value.length > 5) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    
    e.target.value = value;
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

  // Função para gerar número de pedido único
  function gerarNumeroPedido() {
    return Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  }

  // Função para adicionar pedido à lista de pendentes
  function adicionarPedidoPendente(metodoPagamento) {
    const items = document.querySelectorAll('.carrinho-item');
    const numeroPedido = gerarNumeroPedido();
    
    // Salva os dados do formulário
    const formData = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      cpf: document.getElementById('cpf').value,
      cep: document.getElementById('cep').value,
      cidade: document.getElementById('cidade').value,
      rua: document.getElementById('rua').value,
      complemento: document.getElementById('complemento').value,
      numero: document.getElementById('numero').value
    };
    
    // Cria o elemento do pedido
    const pedidoItem = document.createElement('div');
    pedidoItem.className = 'pedido-item';
    pedidoItem.setAttribute('data-pedido', numeroPedido);
    pedidoItem.setAttribute('data-form', JSON.stringify(formData));
    
    // Monta o HTML do pedido
    let produtosHTML = '';
    let totalPedido = 0;
    
    items.forEach(item => {
      const nome = item.querySelector('h3').textContent;
      const preco = parseFloat(item.querySelector('.carrinho-item-preco').textContent.replace('R$ ', '').replace('.', '').replace(',', '.'));
      const quantidade = parseInt(item.querySelector('.carrinho-item-quantidade span').textContent);
      const imagem = item.querySelector('img').src;
      
      totalPedido += preco * quantidade;
      
      produtosHTML += `
        <div class="pedido-produto">
          <img src="${imagem}" alt="${nome}">
          <div class="pedido-produto-info">
            <h4>${nome}</h4>
            <p>Quantidade: ${quantidade}</p>
            <p class="pedido-produto-preco">R$ ${(preco * quantidade).toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
      `;
    });
    
    pedidoItem.innerHTML = `
      <div class="pedido-header">
        <span class="pedido-numero">#${numeroPedido}</span>
        <span class="pedido-status">Aguardando ${metodoPagamento}</span>
      </div>
      <div class="pedido-produtos">
        ${produtosHTML}
      </div>
      <div class="pedido-total">
        <span>Total:</span>
        <span>R$ ${totalPedido.toFixed(2).replace('.', ',')}</span>
      </div>
      <div class="pedido-acoes">
        <button class="btn-pagar" onclick="pagarPedido('${numeroPedido}')">
          <i class="ri-bank-card-line"></i> Pagar Agora
        </button>
        <button class="btn-cancelar" onclick="cancelarPedido('${numeroPedido}')">
          <i class="ri-close-circle-line"></i> Cancelar
        </button>
      </div>
    `;
    
    // Adiciona o pedido à lista
    const pedidosLista = document.querySelector('.pedidos-lista');
    pedidosLista.appendChild(pedidoItem);
    
    // Limpa o carrinho
    const carrinhoItems = document.getElementById('carrinho-items');
    carrinhoItems.innerHTML = '';
    atualizarTotal();
  }

  // Modifica o manipulador do formulário de pagamento
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
    
    if (metodoSelecionado === 'PIX' || metodoSelecionado === 'Boleto') {
      // Adiciona o pedido à lista de pendentes
      adicionarPedidoPendente(metodoSelecionado);
      
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
        // Mostra mensagem para boleto
        const mensagemBoleto = document.createElement('div');
        mensagemBoleto.className = 'mensagem-boleto';
        mensagemBoleto.innerHTML = `
          <p>Seu boleto foi gerado e enviado para seu e-mail</p>
          <p>Após o pagamento, você receberá uma confirmação</p>
        `;
        form.appendChild(mensagemBoleto);
        btnConfirmar.style.display = 'none';
      }
    } else {
      // Processa pagamento com cartão
      setTimeout(() => {
        // Coleta informações do pedido
        const items = document.querySelectorAll('.carrinho-item');
        const numeroPedido = gerarNumeroPedido();
        const produtos = [];
        let totalPedido = 0;

        items.forEach(item => {
          const nome = item.querySelector('h3').textContent;
          const preco = parseFloat(item.querySelector('.carrinho-item-preco').textContent.replace('R$ ', '').replace('.', '').replace(',', '.'));
          const quantidade = parseInt(item.querySelector('.carrinho-item-quantidade span').textContent);
          const imagem = item.querySelector('img').src;
          
          produtos.push({
            nome,
            preco,
            quantidade,
            imagem
          });
          
          totalPedido += preco * quantidade;
        });

        // Adiciona o pedido à lista de confirmados
        const pedidoConfirmado = {
          numero: numeroPedido,
          status: 'Confirmado',
          produtos: produtos,
          timeline: [
            {
              titulo: 'Pedido Confirmado',
              data: new Date().toISOString(),
              status: 'completed',
              icon: 'ri-check-line'
            },
            {
              titulo: 'Em preparação',
              data: new Date(Date.now() + 3600000).toISOString(), // 1 hora depois
              status: 'pending',
              icon: 'ri-shopping-bag-line'
            },
            {
              titulo: 'Aguardando embalagem',
              data: new Date(Date.now() + 7200000).toISOString(), // 2 horas depois
              status: 'pending',
              icon: 'ri-box-3-line'
            },
            {
              titulo: 'Enviado',
              data: new Date(Date.now() + 10800000).toISOString(), // 3 horas depois
              status: 'pending',
              icon: 'ri-truck-line'
            }
          ]
        };

        // Adiciona o pedido ao array de pedidos confirmados
        pedidosConfirmados.push(pedidoConfirmado);

        // Esvazia o carrinho
        const carrinhoItems = document.getElementById('carrinho-items');
        carrinhoItems.innerHTML = '';
        
        // Atualiza o total para zero
        document.querySelector('.total-info:first-child span:last-child').textContent = 'R$ 0,00';
        document.getElementById('total-carrinho').textContent = '0,00';
        
        // Limpa o localStorage e atualiza o contador
        localStorage.removeItem('carrinhoItems');
        localStorage.setItem('quantidadeCarrinho', '0');
        atualizarContadorCarrinho();
        
        // Esconde o formulário
        form.style.display = 'none';
        
        // Mostra a animação de sucesso
        const animacaoSucesso = document.getElementById('animacao-sucesso');
        animacaoSucesso.style.display = 'block';
        
        // Toca um som de sucesso (opcional)
        const audio = new Audio('./carrinho/sons/success.mp3');
        audio.play().catch(() => {});
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
    const cardsPerView = window.innerWidth > 1200 ? 4 : window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
    const totalSlides = Math.ceil(cards.length / cardsPerView);
    
    // Criar dots
    function criarDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function updateCarrossel() {
        const cardWidth = 100 / cardsPerView;
        const offset = currentIndex * -100;
        carrossel.style.transform = `translateX(${offset}%)`;
        
        // Atualizar estado dos botões
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.5' : '1';
        
        // Atualizar dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
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

    // Atualizar cards por visualização quando a janela for redimensionada
    window.addEventListener('resize', () => {
        const newCardsPerView = window.innerWidth > 1200 ? 4 : window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
        if (newCardsPerView !== cardsPerView) {
            currentIndex = 0;
            criarDots();
            updateCarrossel();
        }
    });
    
    // Inicializar carrossel
    criarDots();
    updateCarrossel();
  });

  // Validação do nome completo
  document.getElementById('nome').addEventListener('input', function(e) {
    // Remove apenas números e caracteres especiais, mantendo acentos e espaços
    let value = e.target.value.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
    e.target.value = value;
  });

  // Validação da cidade
  document.getElementById('cidade').addEventListener('input', function(e) {
    // Remove apenas números e caracteres especiais, mantendo acentos e espaços
    let value = e.target.value.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
    e.target.value = value;
  });

  // Validação do complemento
  document.getElementById('complemento').addEventListener('input', function(e) {
    // Remove apenas números e caracteres especiais, mantendo acentos e espaços
    let value = e.target.value.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
    e.target.value = value;
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

  function adicionarAoCarrinho(button) {
    const produtoCard = button.closest('.produto-card');
    const nome = produtoCard.querySelector('h3').textContent;
    const preco = produtoCard.querySelector('.preco').textContent;
    const imagem = produtoCard.querySelector('img').src;

    // Cria o novo item do carrinho
    const novoItem = document.createElement('div');
    novoItem.className = 'carrinho-item';
    novoItem.innerHTML = `
      <img src="${imagem}" alt="${nome}">
      <div class="carrinho-item-info">
        <h3>${nome}</h3>
        <p class="carrinho-item-preco">${preco}</p>
        <div class="carrinho-item-quantidade">
          <button onclick="diminuirQuantidade(this)">
            <i class="ri-subtract-line"></i>
          </button>
          <span>1</span>
          <button onclick="aumentarQuantidade(this)">
            <i class="ri-add-line"></i>
          </button>
        </div>
      </div>
      <button onclick="removerItem(this)" class="remover-item">
        <i class="ri-delete-bin-line"></i>
      </button>
    `;

    // Adiciona o item ao carrinho
    const carrinhoItems = document.getElementById('carrinho-items');
    carrinhoItems.appendChild(novoItem);

    // Atualiza o total e o contador
    atualizarTotal();
    atualizarContadorCarrinho();
    salvarCarrinho();

    // Adiciona animação de sucesso
    button.innerHTML = '<i class="ri-check-line"></i> Adicionado!';
    button.style.background = '#4CAF50';
    
    setTimeout(() => {
      button.innerHTML = 'Adicionar ao Carrinho';
      button.style.background = '#64d348';
    }, 2000);
  }

  // Adiciona event listeners para os botões de adicionar ao carrinho
  const botoesAdicionar = document.querySelectorAll('.btn-adicionar');
  botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', function() {
      adicionarAoCarrinho(this);
    });
  });

  function verPedidosPendentes() {
    const popup = document.getElementById('popup-pedidos');
    const pedidosLista = document.querySelector('.pedidos-lista');
    
    // Verifica se há pedidos pendentes
    if (pedidosLista.children.length === 0) {
        pedidosLista.innerHTML = `
            <div class="sem-pedidos">
                <i class="ri-time-line"></i>
                <p>Nenhum pedido pendente no momento</p>
            </div>
        `;
    }
    
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function fecharPopupPedidos() {
    const popup = document.getElementById('popup-pedidos');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function pagarPedido(numeroPedido) {
    // Fecha o popup de pedidos pendentes
    fecharPopupPedidos();
    
    // Mostra o popup de pagamento
    const popupPagamento = document.getElementById('popup-pagamento');
    popupPagamento.style.display = 'block';
    
    // Restaura os dados do pedido
    const pedido = document.querySelector(`[data-pedido="${numeroPedido}"]`);
    const metodoPagamento = pedido.querySelector('.pedido-status').textContent.replace('Aguardando ', '');
    
    // Seleciona o método de pagamento original
    const metodosPagamento = document.querySelectorAll('.metodo-pagamento');
    metodosPagamento.forEach(metodo => {
      if (metodo.querySelector('p').textContent === metodoPagamento) {
        metodo.classList.add('selected');
        selecionarMetodo(metodo);
      } else {
        metodo.classList.remove('selected');
      }
    });
    
    // Restaura os dados do formulário
    const form = document.getElementById('form-pagamento');
    form.style.display = 'block';
    
    // Remove mensagens anteriores
    const mensagemPix = document.querySelector('.mensagem-pix');
    const mensagemBoleto = document.querySelector('.mensagem-boleto');
    if (mensagemPix) mensagemPix.remove();
    if (mensagemBoleto) mensagemBoleto.remove();
    
    // Mostra o botão de confirmar
    const btnConfirmar = document.querySelector('.btn-confirmar');
    btnConfirmar.style.display = 'block';
    btnConfirmar.disabled = false;
    btnConfirmar.innerHTML = 'Confirmar Pagamento';
    
    // Habilita os campos do formulário
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.disabled = false;
      input.style.backgroundColor = '';
      input.style.cursor = '';
    });
    
    // Habilita os métodos de pagamento
    metodosPagamento.forEach(metodo => {
      metodo.style.pointerEvents = '';
      metodo.style.opacity = '';
    });
  }

  function cancelarPedido(numeroPedido) {
    const pedido = document.querySelector(`[data-pedido="${numeroPedido}"]`);
    
    // Adiciona animação de fade out
    pedido.style.opacity = '0';
    pedido.style.transform = 'translateX(20px)';
    pedido.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
      // Remove o pedido
      pedido.remove();
      
      // Verifica se não há mais pedidos
      const pedidosLista = document.querySelector('.pedidos-lista');
      if (pedidosLista.children.length === 0) {
        // Se não houver mais pedidos, fecha o popup
        fecharPopupPedidos();
      }
    }, 300);
  }

  // Fecha o popup ao clicar fora dele
  document.getElementById('popup-pedidos').addEventListener('click', function(e) {
    if (e.target === this) {
      fecharPopupPedidos();
    }
  });

  // Função para abrir o popup de pedidos confirmados
  function verPedidosConfirmados() {
    const popup = document.querySelector('.popup-confirmados');
    popup.style.display = 'flex';
    carregarPedidosConfirmados();
  }

  // Função para fechar o popup de pedidos confirmados
  function fecharPedidosConfirmados() {
    const popup = document.querySelector('.popup-confirmados');
    popup.style.display = 'none';
  }

  // Função para carregar os pedidos confirmados
  function carregarPedidosConfirmados() {
    const lista = document.querySelector('.confirmados-lista');
    lista.innerHTML = '';

    // Se não houver pedidos, mostra mensagem
    if (pedidosConfirmados.length === 0) {
        lista.innerHTML = `
            <div class="sem-pedidos">
                <i class="ri-inbox-line"></i>
                <p>Nenhum pedido confirmado ainda</p>
            </div>
        `;
        return;
    }

    pedidosConfirmados.forEach(pedido => {
        const pedidoElement = document.createElement('div');
        pedidoElement.className = 'pedido-confirmado';
        
        // Calcula o total do pedido
        const totalPedido = pedido.produtos.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);
        
        pedidoElement.innerHTML = `
            <div class="pedido-confirmado-header">
                <span class="pedido-confirmado-numero">#${pedido.numero}</span>
                <span class="pedido-confirmado-status">${pedido.status}</span>
            </div>
            <div class="pedido-confirmado-produtos">
                ${pedido.produtos.map(produto => `
                    <div class="pedido-confirmado-produto">
                        <img src="${produto.imagem}" alt="${produto.nome}">
                        <div class="pedido-confirmado-produto-info">
                            <h4>${produto.nome}</h4>
                            <p>Quantidade: ${produto.quantidade}</p>
                            <p class="pedido-confirmado-produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>
                `).join('')}
                <div class="pedido-confirmado-total">
                    <span>Total do Pedido:</span>
                    <span>R$ ${totalPedido.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
            <div class="pedido-confirmado-timeline">
                ${pedido.timeline.map(item => `
                    <div class="timeline-item ${item.status}">
                        <div class="timeline-icon">
                            <i class="${item.icon}"></i>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-title">${item.titulo}</div>
                            <div class="timeline-date">${formatarData(item.data)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        lista.appendChild(pedidoElement);
    });
  }

  // Função para formatar a data
  function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
  }

  // Função para salvar os itens do carrinho no localStorage
  function salvarCarrinho() {
    const items = document.querySelectorAll('.carrinho-item');
    const carrinhoItems = [];
    
    items.forEach(item => {
        carrinhoItems.push({
            nome: item.querySelector('h3').textContent,
            preco: item.querySelector('.carrinho-item-preco').textContent,
            imagem: item.querySelector('img').src,
            quantidade: item.querySelector('.carrinho-item-quantidade span').textContent
        });
    });
    
    localStorage.setItem('carrinhoItems', JSON.stringify(carrinhoItems));
  }

  // Função para carregar os itens do carrinho do localStorage
  function carregarCarrinho() {
    const carrinhoItems = JSON.parse(localStorage.getItem('carrinhoItems')) || [];
    const carrinhoContainer = document.getElementById('carrinho-items');
    
    carrinhoContainer.innerHTML = '';
    
    carrinhoItems.forEach(item => {
        const novoItem = document.createElement('div');
        novoItem.className = 'carrinho-item';
        novoItem.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="carrinho-item-info">
                <h3>${item.nome}</h3>
                <p class="carrinho-item-preco">${item.preco}</p>
                <div class="carrinho-item-quantidade">
                    <button onclick="diminuirQuantidade(this)">
                        <i class="ri-subtract-line"></i>
                    </button>
                    <span>${item.quantidade}</span>
                    <button onclick="aumentarQuantidade(this)">
                        <i class="ri-add-line"></i>
                    </button>
                </div>
            </div>
            <button onclick="removerItem(this)" class="remover-item">
                <i class="ri-delete-bin-line"></i>
            </button>
        `;
        carrinhoContainer.appendChild(novoItem);
    });
    
    atualizarTotal();
    atualizarContadorCarrinho();
  }

  // Carrega o carrinho quando a página é carregada
  document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinho();
  });