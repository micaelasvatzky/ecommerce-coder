import express from "express";
import router from "./routes/index.js";


const app = express();

//Middlewares
app.use(express.json()); //Nos permite leer archivo json
app.use(express.urlencoded({ extended: true }));

//prefijo virtual: poner un path para todos los archivos estáticos
app.use("/static", express.static("public"));

app.use("/api", router);

app.listen(8080, () => {
  console.log("Server on port 8080");
});
