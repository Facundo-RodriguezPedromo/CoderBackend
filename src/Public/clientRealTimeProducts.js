document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const productList = document.getElementById('product-list');
    const addProductForm = document.getElementById('add-product-form');
    const deleteProductForm = document.getElementById('delete-product-form');

    // Solicitar la lista de productos al cargar la página
    socket.emit('requestProducts');

    // Manejar la respuesta de la lista de productos
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
            productDescription.textContent = `Descripción: ${product.description}`;

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

    // Manejar el formulario para agregar un producto
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const category = document.getElementById('product-category').value;
        const description = document.getElementById('product-description').value;
        const stock = parseInt(document.getElementById('product-stock').value, 10);
        const code = document.getElementById('product-code').value;
        socket.emit('addProduct', { name, price, category, description, stock, code });
        addProductForm.reset();
    });

    // Manejar el formulario para eliminar un producto
    deleteProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = parseInt(document.getElementById('delete-product-id').value);
        socket.emit('deleteProduct', id);
        deleteProductForm.reset();
    });
});