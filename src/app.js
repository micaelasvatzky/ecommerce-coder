import express from "express";
import router from "./routes/index.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
const port = 8080;


const app = express();

//Middlewares
app.use(express.json()); //Nos permite leer archivo json
app.use(express.urlencoded({ extended: true }));

//prefijo virtual: poner un path para todos los archivos estáticos
app.use(express.static("./src/public"));

app.use("/api", router);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

const httpServer = app.listen(port, () => {
  console.log(`Escuchando en el http://localhost:${port}`); 
});

//Instancia de socket.io en backend
const io = new Server(httpServer);

//Debo traer el array de productos:
import { ProductManager } from "./managers/ProductManager.js";
const productManager = new ProductManager();

io.on("connection", async(socket)=> {
  console.log("Un cliente se conectó");

  socket.emit("productos", await productManager.getProducts());
})