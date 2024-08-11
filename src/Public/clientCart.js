document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const cartList = document.getElementById('cart-list');

    // Solicitar la lista de productos en el carrito al cargar la página
    socket.emit('requestCartItems');

    // Manejar la respuesta de la lista de productos en el carrito
    socket.on('updateCart', (cartItems) => {
        cartList.innerHTML = cartItems.map(item =>
            `<div class="cart-item">
                <div class="cart-product-id">ID: ${item._id}</div>
                <div class="cart-product-name">Nombre: ${item.name}</div>
                <div class="cart-product-price">Precio: ${item.price}</div>
                <div class="cart-product-category">Categoría: ${item.category}</div>
                <div class="cart-product-description">Descripción: ${item.description}</div>
                <div class="cart-product-stock">Stock: ${item.stock}</div>
                <div class="cart-product-code">Código: ${item.code}</div>
                <div class="cart-product-quantity">Cantidad: ${item.quantity}</div>
            </div>`
        ).join('');
    });
});