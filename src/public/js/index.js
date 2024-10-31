const socket = io("http://localhost:8080");
//Instancia del lado del cliente
const deleteButton = document.getElementsByClassName("delete");
const saveProduct = document.getElementById("saveProduct");
const btnAdd = document.getElementById("btnAdd");

console.log("Funciona");

btnAdd.addEventListener("click", (e) => {
  e.preventDefault();

  document.querySelector("form").classList.remove("nodisp");
});


saveProduct.addEventListener("click", (e) => {
  e.preventDefault();

  const newProduct = {
    title: document.getElementById("title").value,
    desc: document.getElementById("desc").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: true
  };

  if (!newProduct.title || !newProduct.desc || !newProduct.price) {
    alert("Falta completar algunos campos");
  } else {
    socket.emit("newProduct", newProduct);
    console.log(newProduct);
  }

  // Limpiar formulario y ocultarlo
  document.querySelector("form").classList.add("nodisp");
  document.querySelector("form").reset();
});

// Escuchar lista de productos actualizada desde el servidor
socket.on("productos", (productos) => {
  // Generar HTML de productos
  let htmlProductos = "";
  productos.forEach((product) => {
    htmlProductos += `
      <div class="card" id="product-${product._id}">
        <div class="card-img"><div class="img"><img src="${product.thumbnail}" alt=""></div></div>
        <div class="card-title">${product.title}</div>
        <div class="card-subtitle">${product.desc}</div>
        <hr class="card-divider">
        <div class="card-footer">
          <div class="card-price"><span>$</span>${product.price}</div>
          <button class="card-btn delete" data-id="${product._id}">X</button>
        </div>
      </div>`;
  });

  // Actualizar el contenedor de productos con el HTML generado
  contenedorCards.innerHTML = htmlProductos;

  // Asignar evento de eliminación a cada botón
  Array.from(document.getElementsByClassName("delete")).forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const productId = button.dataset.id;
      console.log("delete: " + productId);
      socket.emit("deleteProduct", productId);
    });
  });
});