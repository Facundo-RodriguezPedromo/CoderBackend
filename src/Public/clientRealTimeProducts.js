document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const productList = document.getElementById("product-list");
  const addProductForm = document.getElementById("add-product-form");
  const deleteProductForm = document.getElementById("delete-product-form");

  // Solicitar la lista de productos al cargar la página
  socket.emit("requestProducts");

  // Manejar la respuesta de la lista de productos
  socket.on("updateProducts", (products) => {
    productList.innerHTML = products
      .map(
        (product) =>
          `<div class="product">
                <div class="product-id">ID: ${product._id}</div>
                <div class="product-name">Nombre: ${product.name}</div>
                <div class="product-price">Precio: ${product.price}</div>
                <div class="product-category">Categoría: ${product.category}</div>
                <div class="product-description">Descripción: ${product.description}</div>
                <div class="product-stock">Stock: ${product.stock}</div>
                <div class="product-code">Código: ${product.code}</div>
           </div>`
      )
      .join("");
  });

  // Manejar el formulario para agregar un producto
  addProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const productData = {
      name: document.getElementById("product-name").value,
      price: parseFloat(document.getElementById("product-price").value),
      category: document.getElementById("product-category").value,
      description: document.getElementById("product-description").value,
      stock: parseInt(document.getElementById("product-stock").value, 10),
      code: document.getElementById("product-code").value
    };
    socket.emit("addProduct", productData);
  });

  // Manejar el formulario para eliminar un producto
  deleteProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const codeID = document.getElementById("delete-product-codeID").value;
    socket.emit("deleteProduct", codeID);
  });
});