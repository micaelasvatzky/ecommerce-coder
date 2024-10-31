import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://micaelasvatzky:voley1234@cluster0.u4ack.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conectados a la BD"))
  .catch((error) => console.log("Tenemos un error ", error));
