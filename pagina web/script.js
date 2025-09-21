// --- VARIABLES GLOBALES ---
let cart = [];
let deliveryCost = 0;
const deliveryZones = ["carabayllo", "comas", "olivos", "puente piedra"];

// --- FUNCIONES DEL CARRITO ---
function addToCart(productName, price) {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) existingProduct.quantity++;
    else cart.push({ name: productName, price: price, quantity: 1 });
    showToast(`${productName} fue agregado al carrito.`);
    updateCartUI();
}
function addTeToCart() {
  const tipo = document.getElementById('te-tipo').value;
  addToCart(tipo, 3);
}
function addCola600ToCart() {
  const tipo = document.getElementById('cola-tipo-600').value;
  addToCart(`${tipo} (600ml)`, 5);
}

// --- FUNCIONES DE LA INTERFAZ (UI) ---
function showToast(message) {
    const toast = document.getElementById('add-to-cart-toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// MODIFICADO: Actualiza el botón flotante y el resumen
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const floatBtn = document.getElementById('cart-float-btn');
    const floatCount = document.getElementById('cart-count-float');
    
    if (totalItems > 0) {
        floatCount.textContent = totalItems;
        floatBtn.classList.add('show');
    } else {
        floatBtn.classList.remove('show');
    }
    
    updateOrderSummary();
}

function toggleCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        if (cart.length === 0) {
            alert("Tu carrito está vacío. ¡Agrega un delicioso chicharrón para continuar!");
            return;
        }
        deliveryCost = 0;
        updatePaymentInfo();
        updateOrderSummary();
        modal.style.display = 'flex';
    }
}

// --- LÓGICA DEL CHECKOUT (sin cambios) ---
function selectDelivery(element, method) {
    document.querySelectorAll('.delivery-option').forEach(option => option.classList.remove('selected'));
    element.classList.add('selected');
    document.getElementById('shipping-method').value = method;
    const deliveryInfoDiv = document.getElementById('delivery-info');
    const storeSelector = document.getElementById('store-selector');
    deliveryCost = 0;
    if (method === 'Delivery') {
        deliveryInfoDiv.style.display = 'block';
        storeSelector.style.display = 'block';
    } else {
        deliveryInfoDiv.style.display = 'none';
        storeSelector.style.display = 'block';
    }
    updateOrderSummary();
}
function calculateDelivery() {
    const addressInput = document.getElementById('address');
    const address = addressInput.value.trim().toLowerCase();
    const calculateBtn = document.querySelector('.calculate-btn');
    if (!address) {
        alert('Por favor, ingresa tu dirección para calcular el costo.');
        return;
    }
    const isZoneValid = deliveryZones.some(zone => address.includes(zone));
    if (!isZoneValid) {
        alert('Lo sentimos, solo hacemos delivery a: Comas, Carabayllo, Los Olivos y Puente Piedra.');
        deliveryCost = 0;
        updateOrderSummary();
        return;
    }
    calculateBtn.disabled = true;
    calculateBtn.textContent = 'Calculando...';
    setTimeout(() => {
        const travelTime = Math.floor(Math.random() * 36) + 10;
        deliveryCost = travelTime;
        alert(`El tiempo de viaje estimado es de ${travelTime} minutos.\nEl costo de envío es de S/ ${deliveryCost.toFixed(2)}.`);
        updateOrderSummary();
        calculateBtn.disabled = false;
        calculateBtn.textContent = 'Calcular costo de envío';
    }, 1500);
}
function updateOrderSummary() {
    const summaryDetails = document.getElementById('summary-details');
    const subtotalSpan = document.getElementById('summary-subtotal');
    const shippingSpan = document.getElementById('summary-shipping');
    const totalSpan = document.getElementById('summary-total');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryCost;
    summaryDetails.innerHTML = cart.length === 0 ? '<p>Tu carrito está vacío.</p>' : '';
    if (cart.length > 0) {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('summary-item');
            itemElement.innerHTML = `<span>${item.quantity} x ${item.name}</span><span>s/ ${(item.price * item.quantity).toFixed(2)}</span>`;
            summaryDetails.appendChild(itemElement);
        });
    }
    subtotalSpan.textContent = `s/ ${subtotal.toFixed(2)}`;
    shippingSpan.textContent = `s/ ${deliveryCost.toFixed(2)}`;
    totalSpan.textContent = `s/ ${total.toFixed(2)}`;
}
function updatePaymentInfo() {
    const paymentInfoBox = document.getElementById('payment-info');
    const selectedRadio = document.querySelector('input[name="payment"]:checked');
    document.querySelectorAll('.payment-option').forEach(option => option.classList.remove('selected'));
    selectedRadio.parentElement.classList.add('selected');
    const selectedPayment = selectedRadio.value;
    let infoHTML = '';
    if (selectedPayment === 'Plin/Yape') {
        infoHTML = `<p><strong>Instrucciones:</strong> Realiza tu pago al número <strong>928 688 178</strong> y envíanos la captura por WhatsApp.</p>`;
    } else if (selectedPayment === 'Tarjeta') {
        infoHTML = `<p><strong>Pago con Tarjeta:</strong> Se te enviará un <strong>link de pago</strong> a tu WhatsApp (comisión adicional del 5%).</p>`;
    }
    paymentInfoBox.innerHTML = infoHTML;
}
function enviarPedido() {
    const nombre = document.getElementById('name').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const local = document.getElementById('local-select').value;
    if (!nombre || !whatsapp) {
        alert('Por favor, completa tu nombre y número de WhatsApp.');
        return;
    }
    const metodoEntrega = document.getElementById('shipping-method').value;
    let infoEntrega = '';
    if (metodoEntrega === 'Delivery') {
        const direccion = document.getElementById('address').value.trim();
        if (!direccion) { alert('Por favor, ingresa tu dirección para el delivery.'); return; }
        if (deliveryCost === 0 && cart.length > 0) { alert('Por favor, calcula el costo de envío antes de continuar.'); return; }
        infoEntrega = `Delivery a: ${direccion}`;
    } else {
        infoEntrega = `Recojo en: ${local}`;
    }
    const metodoPago = document.querySelector('input[name="payment"]:checked').value;
    const subtotal = cart.reduce((acc, el) => acc + el.price * el.quantity, 0);
    const total = subtotal + deliveryCost;
    let mensaje = `*¡Nuevo Pedido de Chicharrón!* 🐷\n\n`;
    mensaje += `*Cliente:* ${nombre}\n*WhatsApp:* ${whatsapp}\n\n`;
    mensaje += `*Local de Origen:* ${local}\n`;
    mensaje += `*Método de Entrega:* ${infoEntrega}\n\n`;
    mensaje += `*Detalle del Pedido:*\n`;
    cart.forEach(item => {
        mensaje += `› ${item.quantity} x ${item.name}\n`;
    });
    mensaje += `---------------------\n`;
    mensaje += `*Subtotal:* S/. ${subtotal.toFixed(2)}\n`;
    if (metodoEntrega === 'Delivery') {
        mensaje += `*Envío:* S/. ${deliveryCost.toFixed(2)}\n`;
    }
    mensaje += `*Total a Pagar:* S/. ${total.toFixed(2)}\n\n`;
    mensaje += `*Método de Pago:* ${metodoPago}\n`;
    const numeroTienda = '51928688178'; 
    const url = `https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// --- FUNCIONES DE ESTADO Y SCROLL ---
function showOpeningHours() {
    alert('Nuestro horario es de Lunes a Sábado de 7:00am a 12:00pm.');
}
function checkOpenStatus() {
  const now = new Date();
  const hour = now.getHours();
  const open = (hour >= 7) && (hour < 12);
  const status = document.getElementById('open-status');
  const clockIcon = '<i class="fas fa-clock"></i>';
  if (open) {
    status.innerHTML = `${clockIcon} <span>Local Abierto</span>`;
    status.classList.remove('closed');
    status.onclick = null;
  } else {
    status.innerHTML = `${clockIcon} <span>Local Cerrado</span>`;
    status.classList.add('closed');
    status.onclick = showOpeningHours;
  }
}
document.addEventListener('DOMContentLoaded', () => {
    checkOpenStatus();
    setInterval(checkOpenStatus, 60000);
    const nav = document.querySelector('.category-nav');
    const header = document.querySelector('.main-header');
    const threshold = header.offsetHeight;
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > threshold) {
            nav.classList.add('nav-stuck');
        } else {
            nav.classList.remove('nav-stuck');
        }
    });
});
