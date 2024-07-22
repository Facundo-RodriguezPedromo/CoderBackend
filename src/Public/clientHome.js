document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const productList = document.getElementById('product-list');

    // Pide la lista
    socket.emit('requestProducts');

    // Res de lista de productos
    socket.on('updateProducts', (products) => {
        productList.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            const productId = document.createElement('div');
            productId.classList.add('product-id');
            productId.textContent = `ID: ${product.id}`;

            const productName = document.createElement('div');
            productName.classList.add('product-name');
            productName.textContent = `Nombre: ${product.name}`;

            const productPrice = document.createElement('div');
            productPrice.classList.add('product-price');
            productPrice.textContent = `Precio: ${product.price}`;

            const productCategory = document.createElement('div');
            productCategory.classList.add('product-category');
            productCategory.textContent = `Categoria: ${product.category}`;

            const productDescription = document.createElement('div');
            productDescription.classList.add('product-description');
            productDescription.textContent = `Descripcion: ${product.description}`;

            const productStock = document.createElement('div');
            productStock.classList.add('product-stock');
            productStock.textContent = `Stock: ${product.stock}`;

            const productCode = document.createElement('div');
            productCode.classList.add('product-code');
            productCode.textContent = `Codigo: ${product.code}`;

            productDiv.appendChild(productId);
            productDiv.appendChild(productName);
            productDiv.appendChild(productPrice);
            productDiv.appendChild(productCategory);
            productDiv.appendChild(productDescription);
            productDiv.appendChild(productStock);
            productDiv.appendChild(productCode);

            productList.appendChild(productDiv);
        });
    });
});