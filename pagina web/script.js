// --- Estado abierto/cerrado ---
function checkOpenStatus() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  // Horario: 7:00am a 12:00pm
  const open = (hour > 7 || (hour === 7 && minute >= 0)) && (hour < 12 || (hour === 12 && minute === 0));
  const status = document.getElementById('open-status');
  if (open) {
    status.textContent = '🟢 Abierto';
    status.classList.remove('closed');
  } else {
    status.textContent = '🔴 Cerrado';
    status.classList.add('closed');
  }
}
setInterval(checkOpenStatus, 30000);
checkOpenStatus();

// --- Carrito funcional ---
let cart = [];

function addToCart(name, price) {
  const index = cart.findIndex(item => item.name === name);
  if (index >= 0) {
    cart[index].qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartCount();
}

function addTamalToCart() {
  var tipo = document.getElementById('tamales-tipo').value;
  addToCart('Tamal ' + tipo.charAt(0).toUpperCase() + tipo.slice(1), 4);
}

function addTeToCart() {
  var tipo = document.getElementById('te-tipo').value;
  addToCart(tipo, 3);
}

function addCola600ToCart() {
  var tipo = document.getElementById('cola-tipo-600').value;
  addToCart(tipo + " (600ml)", 5);
}

function addCola1ltToCart() {
  var tipo = document.getElementById('cola-tipo-1lt').value;
  addToCart(tipo + " (1lt)", 9);
}

function removeFromCart(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((acc, el) => acc + el.qty, 0);
}

function toggleCart() {
  const modal = document.getElementById('cart-modal');
  if (modal.classList.contains('active')) {
    modal.classList.remove('active');
  } else {
    renderCart();
    modal.classList.add('active');
  }
}

function renderCart() {
  const ul = document.getElementById('cart-items');
  ul.innerHTML = '';
  cart.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.qty} x ${item.name}</span><span>S/. ${(item.price * item.qty).toFixed(2)}</span>
      <button onclick="removeFromCart(${i})">–</button>`;
    ul.appendChild(li);
  });
  const total = cart.reduce((acc, el) => acc + el.price * el.qty, 0);
  document.getElementById('cart-total').textContent = `Total: S/. ${total.toFixed(2)}`;
}

// --- Confirmar pedido y mostrar boleta ---
function confirmarPedido() {
  if (!cart.length) {
    alert('Agrega productos al carrito para hacer tu pedido.');
    return;
  }
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  const local = document.getElementById('local-select').value;
  mostrarBoleta(tipo, local);
}

function mostrarBoleta(tipo, local) {
  const modal = document.getElementById('boleta-modal');
  const content = document.getElementById('boleta-content');
  const total = cart.reduce((acc, el) => acc + el.price * el.qty, 0);

  let html = `
    <div class="boleta-logo">
      <img src="Images/logo-cerdito.png" alt="Logo El Secreto del Sabor">
    </div>
    <h2>Boleta de Pedido</h2>
    <ul class="boleta-list">`;
  cart.forEach(item => {
    html += `<li><span>${item.qty} x ${item.name}</span><span>S/. ${(item.price * item.qty).toFixed(2)}</span></li>`;
  });
  html += `</ul>
    <div class="boleta-total">Total: S/. ${total.toFixed(2)}</div>
    <div>Tipo de pedido: <strong>${tipo}</strong></div>
    <div>Recoger en: <strong>${local}</strong></div>
    <button onclick="enviarPedidoWhatsApp()">Enviar pedido por WhatsApp</button>
    <button onclick="cerrarBoleta()">Cerrar</button>
  `;
  content.innerHTML = html;
  modal.classList.add('active');
}

function cerrarBoleta() {
  document.getElementById('boleta-modal').classList.remove('active');
}

function enviarPedidoWhatsApp() {
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  const local = document.getElementById('local-select').value;
  let mensaje = `Hola, quiero hacer este pedido:\n`;
  cart.forEach(item => {
    mensaje += `${item.qty} x ${item.name} - S/. ${(item.price * item.qty).toFixed(2)}\n`;
  });
  mensaje += `Total: S/. ${cart.reduce((acc, el) => acc + el.price * el.qty, 0).toFixed(2)}\n`;
  mensaje += `Opción: ${tipo}\n`;
  mensaje += `Recoger en: ${local}\n`;

  window.open('https://wa.me/51928688178?text=' + encodeURIComponent(mensaje));

}

