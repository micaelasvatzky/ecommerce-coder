const socket = io();
//Instancia del lado del cliente

console.log("Funciona"); 

//Lo que tengo que hacer es escuchar al backend que me va a mandar los productos

socket.on("productos", (data)=>{
    renderProductos(data);
})

//Hay que renderizar en pantalla los productos
//1) Sumar un boton para eliminar productos 
//2) Un formulario para crear nuevos productos
//Todo esto se tiene que actualizar en tiempo real
//(cada vez que eliminas haces que el backend envie nuecamwente la lista de productos actualizados, lo mismo cuando se crea uno nuevo)