const socket = io();
//Instancia del lado del cliente
const deleteButton = document.getElementsByClassName("delete");
const saveProduct = document.getElementById("saveProduct");
const btnAdd = document.getElementById("btnAdd");

console.log("Funciona");

//Lo que tengo que hacer es escuchar al backend que me va a mandar los productos

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
  };

  if (
    newProduct.title.length === 0 ||
    newProduct.desc.length === 0 ||
    newProduct.price.length === 0
  ) {
    alert("Falta completar algunos campos");
  } else {
    socket.emit("newProduct", newProduct);
    console.log(newProduct);
  }

  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("price").value = "";
  document.getElementById("thumbnail").value = "";
  document.getElementById("code").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("category").value = "";

  const log = document.getElementById("products");
  log.innerHTML = `<div class='card-img'><div class='img'><img src=${newProduct.thumbnail} alt=''></div></div>
  <div class='card-title'>${newProduct.title}</div>
  <div class='card-subtitle'>${newProduct.desc}</div>
  <hr class='card-divider'>
  <div class='card-footer'>
      <div class='card-price'><span>$</span>${newProduct.price}</div>
      <button class='card-btn delete' id=${newProduct.id}>X</button>
      <button class='card-btn'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path><path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path><path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z'></path><path d='m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74'"></path></svg>
      </button>
  </div>`;

  document.querySelector("form").classList.add("nodisp");
});

Array.from(deleteButton).forEach((button) => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = button.id;
        console.log("delete: "+ productId);
        socket.emit("deleteProduct", productId);

    })
});

//Hay que renderizar en pantalla los productos
//1) Sumar un boton para eliminar productos
//2) Un formulario para crear nuevos productos
//Todo esto se tiene que actualizar en tiempo real
//(cada vez que eliminas haces que el backend envie nuecamwente la lista de productos actualizados, lo mismo cuando se crea uno nuevo)
