// ------------------- Carrossel -------------------
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const carouselInner = document.querySelector('.carousel-inner');

let currentIndex = 0;

function updateCarousel() {
  const offset = -currentIndex * 100;
  carouselInner.style.transform = `translateX(${offset}vw)`;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
}

nextBtn.addEventListener('click', () => {
  nextSlide();
  resetInterval();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  resetInterval();
});

let slideInterval = setInterval(nextSlide, 5000);

function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
}

// Drag support for carousel
let isDragging = false;
let startPos = 0;

carouselInner.addEventListener('mousedown', (e) => {
  isDragging = true;
  startPos = e.pageX;
  clearInterval(slideInterval);
  carouselInner.style.cursor = 'grabbing';
});
carouselInner.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  const endPos = e.pageX;
  carouselInner.style.cursor = 'grab';
  if (startPos - endPos > 50) nextSlide();
  else if (endPos - startPos > 50) prevSlide();
  resetInterval();
});
carouselInner.addEventListener('mouseleave', () => {
  if (isDragging) {
    isDragging = false;
    carouselInner.style.cursor = 'grab';
    resetInterval();
  }
});
carouselInner.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  // opcional: implementar arrastar visualmente
});

// Iniciar carrossel
updateCarousel();

// ------------------- Carrinho -------------------

const buttonsComprar = document.querySelectorAll('.btn-comprar');
const carrinhoItensDiv = document.getElementById('carrinho-itens');
const totalP = document.getElementById('total');
const btnFinalizar = document.getElementById('finalizar-pedido');

let carrinho = [];

function atualizarCarrinho() {
  carrinhoItensDiv.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;

    const div = document.createElement('div');
    div.classList.add('carrinho-item');

    div.innerHTML = `
      <span>${item.nome} x${item.quantidade}</span>
      <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
      <button class="remove-btn" data-index="${index}">X</button>
    `;

    carrinhoItensDiv.appendChild(div);
  });

  totalP.textContent = `Total: R$ ${total.toFixed(2)}`;

  btnFinalizar.disabled = carrinho.length === 0;

  // adicionar event listener para remover item
  const btnsRemover = document.querySelectorAll('.remove-btn');
  btnsRemover.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      removerDoCarrinho(idx);
    });
  });
}

function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

buttonsComprar.forEach(button => {
  button.addEventListener('click', () => {
    const nome = button.getAttribute('data-item');
    const preco = parseFloat(button.getAttribute('data-preco'));

    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      carrinho.push({ nome, preco, quantidade: 1 });
    }
    atualizarCarrinho();
  });
});

btnFinalizar.addEventListener('click', () => {
  if (carrinho.length === 0) return;

  alert(`Pedido finalizado! Total: R$ ${carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0).toFixed(2)}`);
  carrinho = [];
  atualizarCarrinho();
});

// ------------------- Formulário de contato -------------------
document.getElementById("form-contato").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Mensagem enviada com sucesso!");
});

const metodoPagamento = document.getElementById('metodo-pagamento');
const qrImg = document.getElementById('qr-img');
const pixDiv = document.getElementById('pix-qrcode');
const pagamentoModal = document.getElementById('pagamento-modal');
const confirmarPagamentoBtn = document.getElementById('confirmar-pagamento');
const fecharPagamentoBtn = document.getElementById('fechar-pagamento');

metodoPagamento.addEventListener('change', () => {
  if (metodoPagamento.value === 'pix') {
    const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0).toFixed(2);

    // Gerar QR fictício usando API externa (QR Server)
    const pixTexto = `Pagamento via Pix - Valor: R$ ${total}`;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixTexto)}`;
    qrImg.src = url;
    pixDiv.style.display = 'block';
  } else {
    pixDiv.style.display = 'none';
  }
});

confirmarPagamentoBtn.addEventListener // Dentro do addEventListener dos botões "Adicionar ao Pedido":
localStorage.setItem('carrinho', JSON.stringify(carrinho));
('click', () => {
  const metodo = metodoPagamento.value;
  alert(`Pedido finalizado com sucesso!\nForma de pagamento: ${metodo}`);
  carrinho = [];
  atualizarCarrinho();
  pagamentoModal.style.display = 'none';
});

fecharPagamentoBtn.addEventListener('click', () => {
  pagamentoModal.style.display = 'none';
});

btnFinalizar.addEventListener('click', () => {
  if (carrinho.length === 0) return;

  document.getElementById('pagamento-modal').style.display = 'flex';
});

function atualizarCarrinho() {
  carrinhoItensDiv.innerHTML = '';
  let total = 0;

  if (carrinho.length === 0) {
    carrinhoItensDiv.innerHTML = '<p>Seu carrinho está vazio.</p>';
    totalP.textContent = `Total: R$ 0,00`;
    btnFinalizar.disabled = true;
    return;
  }

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;

    const div = document.createElement('div');
    div.classList.add('carrinho-item');

    div.innerHTML = `
      <div class="pedido-detalhe">
        <strong>${item.nome}</strong> x${item.quantidade}<br>
        <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
      </div>
      <button class="remove-btn" data-index="${index}">Remover</button>
    `;

    carrinhoItensDiv.appendChild(div);
  });

  totalP.textContent = `Total: R$ ${total.toFixed(2)}`;
  btnFinalizar.disabled = false;

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      removerDoCarrinho(idx);
    });
  });
}

function atualizarCarrinho() {
  carrinhoItensDiv.innerHTML = '';
  let total = 0;

  if (carrinho.length === 0) {
    carrinhoItensDiv.innerHTML = '<p>Seu carrinho está vazio.</p>';
    totalP.textContent = 'Total: R$ 0,00';
    btnFinalizar.disabled = true;
    return;
  }

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;

    const div = document.createElement('div');
    div.classList.add('carrinho-item');

    div.innerHTML = `
      <span>${item.nome} x${item.quantidade}</span>
      <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
      <button class="remove-btn" data-index="${index}">X</button>
    `;

    carrinhoItensDiv.appendChild(div);
  });

  totalP.textContent = `Total: R$ ${total.toFixed(2)}`;
  btnFinalizar.disabled = false;

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      removerDoCarrinho(idx);
    });
  });
}

function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

buttonsComprar.forEach(button => {
  button.addEventListener('click', () => {
    const nome = button.getAttribute('data-item');
    const preco = parseFloat(button.getAttribute('data-preco'));

    const itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
      itemExistente.quantidade++;
    } else {
      carrinho.push({ nome, preco, quantidade: 1 });
    }

    atualizarCarrinho();
  });
});

document.getElementById('btn-ver-carrinho').addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let mensagem = "🛍️ Itens no carrinho:\n\n";
  let total = 0;

  carrinho.forEach((item, index) => {
    mensagem += `${index + 1}. ${item.nome} x${item.quantidade} = R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    total += item.preco * item.quantidade;
  });

  mensagem += `\nTotal: R$ ${total.toFixed(2)}`;
  alert(mensagem);

  document.getElementById('pagamento-modal').style.display = 'flex';
});

function fecharModal() {
  document.getElementById('pagamento-modal').style.display = 'none';
  document.getElementById('qrcode').innerHTML = '';
}

function finalizarPagamento(tipo) {
  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  if (tipo === 'pix') {
    const chavePix = 'chavepix@exemplo.com';
    const payload = `Pix para ${chavePix}\nValor: R$ ${total.toFixed(2)}`;

    gerarQRCode(payload);
  } else {
    alert(`Pagamento via ${tipo} confirmado!\nTotal: R$ ${total.toFixed(2)}`);
    carrinho = [];
    fecharModal();
  }
}

function atualizarContadorPedidos() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  let totalItens = 0;
  carrinho.forEach(item => {
    totalItens += item.quantidade;
  });
  document.getElementById('contador-pedidos').textContent = totalItens;
}

atualizarContadorPedidos();

document.getElementById('link-pedidos').addEventListener('click', function(event) {
  event.preventDefault();

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  let mensagem = 'Itens selecionados:\n';
  let total = 0;
  carrinho.forEach(item => {
    mensagem += `${item.nome} x${item.quantidade} — R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    total += item.preco * item.quantidade;
  });
  mensagem += `\nTotal: R$ ${total.toFixed(2)}\n\nEscolha a forma de pagamento:\n1. Dinheiro\n2. Pix\n\nClique OK para Dinheiro, Cancelar para Pix.`;

  if (confirm(mensagem)) {
    alert('Você escolheu pagar em Dinheiro. Obrigado pelo pedido!');
  } else {
    alert('Você escolheu pagar via Pix. Obrigado pelo pedido!');
  }
});


document.getElementById('link-pedidos').addEventListener('click', function(event) {
  event.preventDefault(); // Evita o redirecionamento

  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio.');
    return;
  }

  // Monta a mensagem do alert com os itens e valores
  let mensagem = 'Itens selecionados:\n';
  let total = 0;
  carrinho.forEach(item => {
    mensagem += `${item.nome} x${item.quantidade} — R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    total += item.preco * item.quantidade;
  });
  mensagem += `\nTotal: R$ ${total.toFixed(2)}\n\nEscolha a forma de pagamento:\n1. Dinheiro\n2. Pix\n\nClique OK para Dinheiro, Cancelar para Pix.`;

  if (confirm(mensagem)) {
    alert('Você escolheu pagar em Dinheiro. Obrigado pelo pedido!');
    // Aqui pode implementar o que quiser após o pagamento
  } else {
    alert('Você escolheu pagar via Pix. Obrigado pelo pedido!');
    // Aqui pode abrir o QRCode ou outra ação
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const carrinhoSalvo = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho = carrinhoSalvo;
  atualizarCarrinho();
});

function atualizarCarrinho() {
  // ... código existente ...

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarContadorPedidos();
}



confirmarPagamentoBtn.addEventListener('click', () => {
  const metodo = metodoPagamento.value;
  alert(`Pedido finalizado com sucesso!\nForma de pagamento: ${metodo}`);
  carrinho = [];
  atualizarCarrinho();
  pagamentoModal.style.display = 'none';
  localStorage.removeItem('carrinho');
});

document.getElementById('fechar-carrinho').addEventListener('click', () => {
  document.getElementById('carrinho-modal').style.display = 'none';
});

