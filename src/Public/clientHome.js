document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const productList = document.getElementById("product-list");
  const cartList = document.getElementById("cart-list");

  // Traemos  la lista desde el servidor
  socket.emit("requestProducts");

  // Agregar al carro
  document.addEventListener("click", (event) => {
    if (event.target?.classList.contains("add-to-cart")) {
      const productId = event.target.getAttribute("data-id");
      console.log('Adding product to cart:', productId);
      socket.emit("addProductToCart", { productId });
    }
  });

  // Actualiza la lista del carrito
  socket.on("updateCart", (cartItems) => {
    cartList.innerHTML = cartItems.map(item =>
      `<li>${item.name} - $${item.price} (Cantidad: ${item.quantity})</li>`
    ).join("");
  });

  // Actualiza la lista de productos
  socket.on("updateProducts", (products) => {
    productList.innerHTML = products.map(product =>
      `<div class="product">
        <div class="product-id">ID: ${product._id}</div>
        <div class="product-name">Nombre: ${product.name}</div>
        <div class="product-price">Precio: ${product.price}</div>
        <div class="product-category">Categoría: ${product.category}</div>
        <div class="product-description">Descripción: ${product.description}</div>
        <div class="product-stock">Stock: ${product.stock}</div>
        <div class="product-code">Código: ${product.code}</div>
        
        <button class="add-to-cart" data-id="${product._id}">Agregar al carrito</button>
      </div>`
    ).join("");
  });
});